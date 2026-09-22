/**
 * Response shapes from the DevConnect Portal's public API.
 *
 * These mirror what the portal actually returns — they are not our preferences.
 * Anything the portal documents as nullable is nullable here, so the compiler
 * forces every consumer to handle the empty case instead of discovering it in
 * production.
 *
 * Source of truth: docs/portal-api.md.
 */

export type PortalOfficer = {
  id: string;
  /** The position, e.g. "President". Named `title` by the portal, `role` in our UI. */
  title: string;
  term_year: number | null;
  display_order: number;
  name: string;
  photo_url: string | null;
  bio: string | null;
};

export type PortalEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  /** ISO 8601. Required, so the portal cannot currently express an undated "TBA" event. */
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
};

export type PortalLanding = {
  officers: PortalOfficer[];
  events: PortalEvent[];
  generated_at: string;
};
