import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

/**
 * CON-02-BT-01 (#199): a route handler must never import from a `"use client"` module.
 *
 * On the server, every export of a client module is replaced by a client
 * reference, a function. The contact route imported the Turnstile action name
 * from the widget's file and compared Cloudflare's "contact" with that
 * function, so every visitor was rejected. No suite caught it, because CI has no
 * Turnstile secret and skips verification entirely.
 *
 * Route handlers never render components, so there is no legitimate reason for
 * one to import a client module at all. This checks every route's imports, and
 * the local modules those import in turn.
 *
 * Runs in Node; no browser is involved, so one project is enough.
 */
test.skip(({ browserName }) => browserName !== 'chromium', 'Node-only; browser-independent');

const ROOT = path.resolve(__dirname, '..');
const IMPORT = /^\s*(?:import|export)\s[^;]*?from\s+['"]([^'"]+)['"]/gm;

function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return routeFiles(full);
    return /^route\.tsx?$/.test(name) ? [full] : [];
  });
}

function resolveLocal(from: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith('@/')) base = path.join(ROOT, specifier.slice(2));
  else if (specifier.startsWith('.')) base = path.resolve(path.dirname(from), specifier);
  else return null; // a package, not ours
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const isClientModule = (source: string) => /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*['"]use client['"]/.test(source);

/** Every local module reachable from `entry`, with the chain that reaches it. */
function reachable(entry: string): Map<string, string[]> {
  const seen = new Map<string, string[]>([[entry, [entry]]]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift()!;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(IMPORT)) {
      const target = resolveLocal(file, match[1]);
      if (!target || seen.has(target)) continue;
      seen.set(target, [...seen.get(file)!, target]);
      // A client module is a boundary: what it imports is not the server's concern.
      if (!isClientModule(readFileSync(target, 'utf8'))) queue.push(target);
    }
  }
  return seen;
}

test.describe('CON-02-BT-01 server routes and client modules', () => {
  const routes = routeFiles(path.join(ROOT, 'app'));

  test('the check finds the routes it is meant to guard', () => {
    const names = routes.map((file) => path.relative(ROOT, file).replace(/\\/g, '/'));
    expect(names).toContain('app/api/contact/route.ts');
    expect(names).toContain('app/api/newsletter/route.ts');
  });

  test('it recognises a client module', () => {
    expect(isClientModule(readFileSync(path.join(ROOT, 'components/ui/turnstile-widget.tsx'), 'utf8'))).toBe(true);
    expect(isClientModule(readFileSync(path.join(ROOT, 'lib/turnstile-action.ts'), 'utf8'))).toBe(false);
  });

  for (const route of routes) {
    const name = path.relative(ROOT, route).replace(/\\/g, '/');
    test(`${name} imports nothing from a "use client" module`, () => {
      const offenders = [...reachable(route).entries()]
        .filter(([file]) => file !== route && isClientModule(readFileSync(file, 'utf8')))
        .map(([, chain]) => chain.map((file) => path.relative(ROOT, file).replace(/\\/g, '/')).join(' → '));
      expect(offenders, 'server code would receive a client reference, not the value').toEqual([]);
    });
  }
});
