import type { ReactNode } from 'react';

/**
 * A statement in the legal drafts that the code can't settle, pending the
 * organisation's review (LEGAL-01, #73).
 *
 * Rendered loudly on purpose, as a visible "[TO CONFIRM: …]" marker, so a
 * reviewer can't miss one. `tests/legal.spec.ts` fails while any remains,
 * which stops an unreviewed draft from passing CI. To resolve one, replace the
 * whole `<ToConfirm>` element with the approved text; don't delete the test.
 */
export default function ToConfirm({ children }: { children: ReactNode }) {
  return (
    <mark
      data-to-confirm
      className="rounded bg-devcon-yellow-500 px-1 font-mono text-sm text-devcon-black-500"
    >
      [TO CONFIRM: {children}]
    </mark>
  );
}
