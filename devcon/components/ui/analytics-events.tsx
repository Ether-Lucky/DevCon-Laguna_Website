"use client";

import { useEffect } from 'react';
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics';

/**
 * AnalyticsEvents — reports clicks on elements carrying `data-analytics-id`.
 *
 * Uses a single delegated listener rather than a click handler per button, so
 * `Button` stays a server component and no extra JavaScript ships for each CTA.
 * That matters here: PERF-03 removed 116KB of client JS to cut LCP render delay,
 * and re-adding a client component per button would work against it.
 *
 * Mounted once from the root layout.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>('[data-analytics-id]');
      if (!element) return;

      trackEvent(ANALYTICS_EVENTS.ctaClick, {
        id: element.dataset.analyticsId ?? 'unknown',
        label: (element.textContent ?? '').trim().slice(0, 60),
      });
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
