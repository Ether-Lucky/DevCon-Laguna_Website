/**
 * Shared validation for the contact form.
 *
 * Deliberately dependency-free and used by BOTH the client and the API route, so
 * the rules cannot drift apart. Client-side validation is a convenience; the
 * server re-validates because anything can post to the endpoint.
 */

export type ContactField = 'name' | 'email' | 'subject' | 'message';

export type ContactPayload = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
} as const;

/** Pragmatic address check: something@something.tld with no spaces. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The email rule on its own, shared with the newsletter sign-up (NEWS-01). */
export function validateEmailAddress(value: string): string | undefined {
  const email = value.trim();
  if (!email) return 'Please enter your email address.';
  if (email.length > LIMITS.email.max) return 'That email address is too long.';
  if (!EMAIL.test(email)) return 'Please enter a valid email address.';
  return undefined;
}

export function validateContact(input: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim();
  const subject = (input.subject ?? '').trim();
  const message = (input.message ?? '').trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < LIMITS.name.min) errors.name = 'Please enter your full name.';
  else if (name.length > LIMITS.name.max) errors.name = 'That name is too long.';

  const emailError = validateEmailAddress(email);
  if (emailError) errors.email = emailError;

  if (!subject) errors.subject = 'Please enter a subject.';
  else if (subject.length < LIMITS.subject.min) errors.subject = 'Please give a slightly longer subject.';
  else if (subject.length > LIMITS.subject.max) errors.subject = 'That subject is too long.';

  if (!message) errors.message = 'Please enter a message.';
  else if (message.length < LIMITS.message.min) errors.message = 'Please give a little more detail.';
  else if (message.length > LIMITS.message.max) errors.message = 'That message is too long.';

  return errors;
}
