# Contact Form

How the contact form works, what it needs to actually deliver mail, and how it behaves before
that is configured. Implements **CON-01** (#59), closing **FR-07**.

## Pieces

| File | Role |
|---|---|
| [`lib/contact-schema.ts`](../devcon/lib/contact-schema.ts) | Validation rules, shared by client and server |
| [`components/ui/sections/contact.tsx`](../devcon/components/ui/sections/contact.tsx) | The section and form UI |
| [`app/api/contact/route.ts`](../devcon/app/api/contact/route.ts) | Submission endpoint and email delivery |
| [`tests/contact.spec.ts`](../devcon/tests/contact.spec.ts) | 15 tests covering the form and the endpoint |

## Environment variables

Set these in the Vercel project. **Never commit them.**

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | **yes, to deliver** | Server-side Resend API key |
| `CONTACT_TO_EMAIL` | no | Destination inbox. Defaults to `siteConfig.email` |
| `CONTACT_FROM_EMAIL` | recommended | Sender address on a Resend-verified domain |

### Until the key is set

The endpoint validates the submission and returns **503** with
*"The contact form is not configured yet. Please email us directly."*

That is deliberate. Showing a success message for a mail that was never sent is far worse than
an honest failure — a visitor would believe they had made contact. The form is fully testable
in this state, and the section still shows the direct email address.

### Sender domain

Resend only sends from a **verified domain**. Verifying `devconlaguna.com` means adding DNS
records, which is usually the slowest part of setting this up — start it early. Until then
Resend's shared `onboarding@resend.dev` sender works for testing, but should not be used in
production.

## Behaviour

**Validation runs twice**, against the same rules in `lib/contact-schema.ts`. The client
validates for fast inline feedback; the server validates again because anything can post to the
endpoint, and the browser can be bypassed entirely. Keeping one module means the two cannot
drift apart.

**Input is preserved on failure.** If delivery fails, the entered values stay in the form.
Losing a long message to a network error is the worst outcome here, and a test enforces it.

**Errors are announced.** Invalid fields get `aria-invalid` and `aria-describedby`, each message
carries `role="alert"`, and the success/error banner sits in an `aria-live="polite"` region.

**The honeypot is already in place.** The form includes a hidden `website` field; a real user
never fills it, a naive bot often does. The endpoint answers **200** to those submissions while
sending nothing, so a bot gets no signal it was detected. This is the cheap half of **CON-02**
(#60) — the CAPTCHA half still needs Turnstile keys.

## The `#contact` anchor

The anchor moved from the footer to this section, so the nav "Contact" link lands on the form
rather than below it. The section carries `scroll-mt-28` to keep its heading clear of the
sticky navbar.

> Other sections do **not** have that offset, so jumping to them still tucks the first line
> under the nav. Worth a separate pass across every anchor.

## Testing locally

```bash
cd devcon && pnpm build && pnpm start
```

```bash
# invalid input -> 400 with a message per field
curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"A","email":"nope","subject":"hi","message":"short"}'

# honeypot -> 200, nothing sent
curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"b@example.com","subject":"Spam here","message":"spam message body","website":"http://x"}'
```

The Playwright suite mocks delivery at the network boundary, so it never needs a real key or
sends real mail.
