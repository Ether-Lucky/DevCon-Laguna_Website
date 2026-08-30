# Contact Form

How the contact form works, what it needs to actually deliver mail, and how it behaves before
that is configured. Implements **CON-01** (#59), closing **FR-07**.

## Pieces

| File | Role |
|---|---|
| [`lib/contact-schema.ts`](../devcon/lib/contact-schema.ts) | Validation rules, shared by client and server |
| [`components/ui/sections/contact.tsx`](../devcon/components/ui/sections/contact.tsx) | The section and form UI |
| [`app/api/contact/route.ts`](../devcon/app/api/contact/route.ts) | Submission endpoint and email delivery |
| [`tests/contact.spec.ts`](../devcon/tests/contact.spec.ts) | 19 tests covering the form, the endpoint, and the no-unowned-address rule |

## Environment variables

Set these in the Vercel project. **Never commit them.**

| Variable | Required | Purpose |
|---|---|---|
| `GMAIL_USER` | **yes, to deliver** | Gmail address messages are sent from |
| `GMAIL_APP_PASSWORD` | **yes, to deliver** | 16-character Google app password |
| `CONTACT_TO_EMAIL` | no | Destination inbox. Defaults to `GMAIL_USER` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | no | Turnstile site key. **Must be set at build time** |
| `TURNSTILE_SECRET` | no | Turnstile secret key, server only |
| `TURNSTILE_HOSTNAMES` | with Turnstile | Comma-separated hostnames the widget may be solved on |

### Why Gmail SMTP and not Resend

DevCon Laguna does not own a domain — the site is served from a Vercel subdomain.
Resend, Postmark and SES all require a **verified sending domain**, so none of them can
deliver in production here. Gmail SMTP needs no domain.

### Creating the app password

1. Enable **2-Step Verification** on the Google account (app passwords require it).
2. Go to Google Account → Security → **App passwords**.
3. Generate one for "Mail"; you get 16 characters.
4. Store it as `GMAIL_APP_PASSWORD` in Vercel. It is a credential — treat it like any password.

Use a project or team Gmail account rather than a personal one, since anyone with access to
the deployment settings can read it.

### Until the credentials are set

The endpoint validates the submission and returns **503** with
*"The contact form is not configured yet. Please reach us on social media."*

That is deliberate. Showing a success message for mail that was never sent is far worse than
an honest failure — a visitor would believe they had made contact.

## No email address is displayed

The site previously advertised `hello@devconlaguna.com`, taken from the UI/UX mockup. **That
domain is not owned by DevCon Laguna**, so the address reached nobody, and it was also being
published to search engines in the JSON-LD `email` field.

Both are removed. The Contact section now points at the **Facebook page**, a real staffed
channel, alongside the form and the other social profiles. `siteConfig` deliberately has no
`email` property.

**Do not reintroduce an email address unless the organisation actually controls it.** Four
tests in `tests/contact.spec.ts` enforce this: no `mailto:` link, no occurrence of the domain
in the served HTML, no `email` in the structured data, and the Facebook link present.

## Bot protection (CON-02)

Two independent layers.

### 1. Honeypot — always on

A hidden `website` field. A real user never fills it; a naive bot often does. The endpoint
answers **200** and sends nothing, so a bot gets no signal it was detected. No configuration.

### 2. Cloudflare Turnstile — active once configured

Turnstile is **opt-in**. With no `TURNSTILE_SECRET`, verification returns `skipped` and the
form works normally with the honeypot alone. That keeps the form usable during setup rather
than locking it behind a challenge that is not there yet.

Once a secret **is** set, every failure path is closed: a missing or oversized token, an
unreachable siteverify, a non-2xx response, a non-JSON body, a mismatched action or an
unexpected hostname all reject with **403**.

**Three checks, not one.** `success === true` on its own is not sufficient:

- **`action`** must equal `contact`. Otherwise a token minted for a different surface using the
  same site key would pass. This is not theoretical — during testing, a bogus token was
  rejected specifically by the action check.
- **`hostname`** must be in `TURNSTILE_HOSTNAMES`. Otherwise a token solved on an attacker's
  page using the same site key would pass.

> ⚠️ A production `TURNSTILE_HOSTNAMES` must **not** include `localhost` or `127.0.0.1`.
> Accepting those in production lets a token solved locally be replayed against the live site.

**Tokens are single-use.** The widget is rendered explicitly so the form can hold its id and
call `turnstile.reset()` after every attempt. Without that, a second attempt would reuse a
spent token and fail verification for no visible reason.

**Verification is server-side only.** The browser sends the token to our endpoint; our endpoint
calls siteverify. A browser must never call siteverify — that would expose the secret.

### Setting it up

1. Create a widget at Cloudflare → Turnstile, **Managed** mode.
2. Add the domains: the production hostname, plus `localhost` for development.
3. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` and `TURNSTILE_HOSTNAMES`.
4. **Redeploy.** `NEXT_PUBLIC_*` variables are inlined at build time, so the widget will not
   appear until a build runs with the key present. Setting it on a running deployment does
   nothing.

### Testing it

Cloudflare publishes [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
that always pass or always fail, which is how the enforced path was verified here.

Note the automated suite covers only the unconfigured state. **Turnstile deliberately resists
headless automation**, so a real token cannot be obtained in CI — that is the product working
as intended. The enforced path was checked by hand:

```
no token          → 403  "missing-token"
bogus token       → 403  "action-mismatch"
unconfigured      → 200  (honeypot only, form works)
```

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
