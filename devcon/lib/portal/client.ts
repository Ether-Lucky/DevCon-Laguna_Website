import 'server-only';

import type { PortalLanding, PortalOfficer } from './types';

const DEFAULT_BASE_URL = 'https://devconnect-portal-seven.vercel.app';
const REQUEST_TIMEOUT_MS = 8000;
export const REVALIDATE_SECONDS = 1800;
export const PORTAL_CONTENT_TAG = 'portal-content';

export type PortalResult =
  | { status: 'ok'; data: PortalLanding }
  | { status: 'unconfigured' }
  | { status: 'failed'; reason: string };

function baseUrl(): string {
  return (process.env.PORTAL_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseOfficers(value: unknown): PortalOfficer[] {
  if (!Array.isArray(value)) return [];

  return value.filter((entry): entry is PortalOfficer => {
    if (!isRecord(entry)) return false;

    return (
      typeof entry.id === 'string' &&
      typeof entry.name === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.display_order === 'number' &&
      (entry.photo_url === null || typeof entry.photo_url === 'string')
    );
  });
}

export async function fetchPortalLanding(): Promise<PortalResult> {
  const key = process.env.PORTAL_API_KEY;
  if (!key) return { status: 'unconfigured' };

  try {
    const response = await fetch(`${baseUrl()}/api/public/landing`, {
      headers: { 'x-api-key': key, accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS, tags: [PORTAL_CONTENT_TAG] },
    });

    if (!response.ok) {
      return { status: 'failed', reason: `http-${response.status}` };
    }

    const body: unknown = await response.json();
    if (!isRecord(body)) return { status: 'failed', reason: 'malformed-body' };

    return {
      status: 'ok',
      data: {
        officers: parseOfficers(body.officers),
      },
    };
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'unreachable';
    console.error(`[portal] landing fetch ${reason}:`, error);
    return { status: 'failed', reason };
  }
}
