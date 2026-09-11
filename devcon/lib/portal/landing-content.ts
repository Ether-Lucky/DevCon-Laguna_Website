import "server-only";

import { events as bundledEvents, type Category, type EventItem } from "@/lib/content/events";
import { team as bundledOfficers, type TeamMember } from "@/lib/content/officers";
import { slides as bundledAboutSlides, type Slide } from "@/lib/content/about-devcon-slideshow";
import { whatWeDo as bundledWhatWeDo, type WhatWeDoItem } from "@/lib/content/what-we-do";

const PORTAL_CONTENT_REVALIDATE_SECONDS = 60 * 30;
const PORTAL_CONTENT_TAG = "portal-content";
const REQUEST_TIMEOUT_MS = 8_000;
const CATEGORY_VALUES = new Set<Category>(["hackaton", "workshop", "seminar", "community", "career"]);
const DEFAULT_PORTAL_API_BASE_URL = "https://devconnect-portal-seven.vercel.app";

type RecordValue = Record<string, unknown>;

export interface LandingContent {
  events: EventItem[];
  officers: TeamMember[];
  aboutSlides: Slide[];
  whatWeDo: WhatWeDoItem[];
  source: "portal" | "fallback";
}

const fallbackLandingContent: LandingContent = {
  events: bundledEvents,
  officers: bundledOfficers,
  aboutSlides: bundledAboutSlides,
  whatWeDo: bundledWhatWeDo,
  source: "fallback",
};

function asRecord(value: unknown): RecordValue | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as RecordValue;
}

function pickString(record: RecordValue, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function pickNumber(record: RecordValue, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function pickArray(record: RecordValue, keys: string[]): unknown[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return undefined;
}

function pickRecord(record: RecordValue, keys: string[]): RecordValue | undefined {
  for (const key of keys) {
    const value = asRecord(record[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function formatPortalDate(rawDate: string): string {
  if (rawDate.toUpperCase() === "TBA") return "TBA";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function parseEvents(rawEvents: unknown[] | undefined): EventItem[] | null {
  if (!rawEvents?.length) return null;

  const parsed: EventItem[] = [];

  for (let index = 0; index < rawEvents.length; index += 1) {
    const event = asRecord(rawEvents[index]);
    if (!event) return null;

    const title = pickString(event, ["title", "name"]);
    const categoryValue = pickString(event, ["category", "event_category"])?.toLowerCase();
    if (!title || !categoryValue || !CATEGORY_VALUES.has(categoryValue as Category)) {
      return null;
    }

    const date = pickString(event, ["date", "start_date", "event_date"]) ?? "TBA";
    const img = pickString(event, ["img", "image", "image_url", "thumbnail_url"]);
    const parsedEvent: EventItem = {
      id: pickNumber(event, ["id", "event_id"]) ?? index + 1,
      title,
      date: formatPortalDate(date),
      category: categoryValue as Category,
    };

    if (img) {
      parsedEvent.img = img;
    }

    parsed.push(parsedEvent);
  }

  return parsed.length > 0 ? parsed : null;
}

function parseOfficers(rawOfficers: unknown[] | undefined): TeamMember[] | null {
  if (!rawOfficers?.length) return null;

  const parsed: TeamMember[] = [];

  for (let index = 0; index < rawOfficers.length; index += 1) {
    const officer = asRecord(rawOfficers[index]);
    if (!officer) return null;

    const name = pickString(officer, ["name", "full_name"]);
    const role = pickString(officer, ["role", "position", "title"]);
    if (!name || !role) {
      return null;
    }

    const accent = pickString(officer, ["accent", "accent_color"]) as TeamMember["accent"] | undefined;
    const img = pickString(officer, ["img", "image", "image_url", "avatar_url", "photo_url"]);
    const parsedOfficer: TeamMember = {
      id: pickNumber(officer, ["id", "officer_id"]) ?? index + 1,
      name,
      role,
      width: pickNumber(officer, ["width", "image_width"]) ?? 960,
      height: pickNumber(officer, ["height", "image_height"]) ?? 960,
      accent: accent && ["yellow", "orange", "purple", "lime"].includes(accent) ? accent : "purple",
    };

    if (img) {
      parsedOfficer.img = img;
    }

    parsed.push(parsedOfficer);
  }

  return parsed.length > 0 ? parsed : null;
}

function parseSlides(rawSlides: unknown[] | undefined): Slide[] | null {
  if (!rawSlides?.length) return null;

  const parsed: Slide[] = [];
  for (let index = 0; index < rawSlides.length; index += 1) {
    const slide = asRecord(rawSlides[index]);
    if (!slide) return null;

    const src = pickString(slide, ["src", "img", "image", "image_url", "url"]);
    if (!src) return null;

    parsed.push({
      id: pickNumber(slide, ["id", "slide_id"]) ?? index + 1,
      src,
      alt: pickString(slide, ["alt", "title", "description"]) ?? "DevCon Laguna event",
      width: pickNumber(slide, ["width", "image_width"]) ?? 1920,
      height: pickNumber(slide, ["height", "image_height"]) ?? 1080,
    });
  }

  return parsed.length > 0 ? parsed : null;
}

function parseWhatWeDoItems(rawItems: unknown[] | undefined): WhatWeDoItem[] | null {
  if (!rawItems?.length) return null;

  const parsed: WhatWeDoItem[] = [];
  for (let index = 0; index < rawItems.length; index += 1) {
    const item = asRecord(rawItems[index]);
    if (!item) return null;

    const title = pickString(item, ["title", "name"]);
    const img = pickString(item, ["img", "image", "image_url", "url"]);
    if (!title || !img) return null;

    parsed.push({
      id: pickNumber(item, ["id", "image_id"]) ?? index + 1,
      title,
      img,
      width: pickNumber(item, ["width", "image_width"]) ?? 596,
      height: pickNumber(item, ["height", "image_height"]) ?? 596,
      isTall: Boolean(item.isTall ?? item.is_tall),
    });
  }

  return parsed.length > 0 ? parsed : null;
}

function parseLandingContent(payload: unknown): LandingContent | null {
  const root = asRecord(payload);
  if (!root) return null;

  const data = asRecord(root.data) ?? root;
  const images = pickRecord(data, ["landing_images", "images", "landingImages"]) ?? {};

  const parsedEvents = parseEvents(pickArray(data, ["events", "featured_events"]));
  const parsedOfficers = parseOfficers(pickArray(data, ["officers", "team"]));
  if (!parsedEvents || !parsedOfficers) {
    return null;
  }

  return {
    events: parsedEvents,
    officers: parsedOfficers,
    aboutSlides:
      parseSlides(pickArray(images, ["about", "about_slides", "carousel", "carousel_images"])) ?? bundledAboutSlides,
    whatWeDo:
      parseWhatWeDoItems(pickArray(images, ["what_we_do", "whatWeDo", "activities", "activity_images"])) ??
      bundledWhatWeDo,
    source: "portal",
  };
}

function portalApiBaseUrl(): string {
  return (process.env.PORTAL_API_BASE_URL?.trim() || DEFAULT_PORTAL_API_BASE_URL).replace(/\/+$/, "");
}

function portalApiHeaders(apiKey: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `******
    "x-api-key": apiKey,
  };
}

export async function getLandingContent(): Promise<LandingContent> {
  const apiKey = process.env.PORTAL_PUBLIC_API_KEY?.trim();
  if (!apiKey) {
    return fallbackLandingContent;
  }

  try {
    const response = await fetch(`${portalApiBaseUrl()}/api/public/landing`, {
      method: "GET",
      headers: portalApiHeaders(apiKey),
      next: { revalidate: PORTAL_CONTENT_REVALIDATE_SECONDS, tags: [PORTAL_CONTENT_TAG] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return fallbackLandingContent;
    }

    const parsed = parseLandingContent(await response.json());
    return parsed ?? fallbackLandingContent;
  } catch {
    return fallbackLandingContent;
  }
}

export { PORTAL_CONTENT_REVALIDATE_SECONDS, PORTAL_CONTENT_TAG };
