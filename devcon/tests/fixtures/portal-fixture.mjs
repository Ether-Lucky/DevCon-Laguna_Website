/**
 * A stand-in for the DevConnect Portal's public API (TEST-01).
 *
 * The site has only ever been tested against a portal that answers nothing: CI
 * runs with no `PORTAL_API_KEY`, so every suite so far has exercised the
 * fallback path. This serves a controlled `/api/public/landing` so the path a
 * visitor will actually get — officers, events and images from the portal — is
 * tested by a machine rather than by someone remembering to look.
 *
 * Deliberately plain Node with no dependencies: a fixture that needs its own
 * framework is a second thing that can break.
 *
 * Run by Playwright's `webServer`. `PORT` and `FIXTURE_API_KEY` come from
 * playwright.config.ts.
 */

import { createServer } from 'node:http';
import { FIXTURE } from './portal-payload.mjs';

const PORT = Number(process.env.PORT ?? 3999);
const API_KEY = process.env.FIXTURE_API_KEY ?? 'fixture-key';

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`);

  if (url.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('ok');
    return;
  }

  if (url.pathname !== '/api/public/landing' && url.pathname !== '/api/public/posts') {
    response.writeHead(404, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: 'not found' }));
    return;
  }

  // The real portal rejects a request without the key. Answering anyway would
  // mean the suite could not tell a site that sends the key from one that does
  // not — and sending it is the whole reason the fetch is server-side.
  if (request.headers['x-api-key'] !== API_KEY) {
    response.writeHead(401, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }

  response.writeHead(200, {
    'content-type': 'application/json',
    // Matches the real portal: it cannot cache a response keyed on a credential
    // it does not see, so caching is the consumer's job.
    'cache-control': 'private, no-store',
  });
  // `/api/public/landing` carries the three most recent posts; `/api/public/posts`
  // carries all of them. The fixture has two, so both are the same list — the
  // difference that matters to the site is which endpoint it asks.
  response.end(
    JSON.stringify(url.pathname === '/api/public/posts' ? { posts: FIXTURE.posts } : FIXTURE),
  );
});

server.listen(PORT, () => {
  console.log(`[portal-fixture] listening on http://localhost:${PORT}`);
});
