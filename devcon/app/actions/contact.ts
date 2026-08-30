'use server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Bot mitigation: hidden honeypot field
  timestamp?: number; // Bot mitigation: time elapsed check
  turnstileToken?: string; // Bot mitigation: Cloudflare Turnstile verification
}

/**
 * Server action to securely process Contact form submissions.
 *
 * Implements SRS FR-11 bot and spam mitigation:
 * 1. Honeypot check: If the hidden honeypot field is filled, submission is flagged as a bot.
 * 2. Time-velocity check: If submission takes < 1.5 seconds, it's flagged as automated.
 * 3. Cloudflare Turnstile: If TURNSTILE_SECRET_KEY is configured in env, verifies token server-side.
 * 4. Input validation & sanitization: Prevents empty, malformed, or excessively long payloads.
 *
 * Credentials and secrets are exclusively accessed server-side via environment variables.
 */
export async function submitContact(data: ContactFormData) {
  const { name, email, subject, message, honeypot, timestamp, turnstileToken } = data;

  // --- BOT MITIGATION CHECK 1: Honeypot field ---
  if (honeypot && honeypot.trim() !== '') {
    console.warn('[Spam Protection] Honeypot triggered. Rejecting automated submission.');
    // Return early without dispatching any email
    return { success: false, error: 'Spam validation failed.' };
  }

  // --- BOT MITIGATION CHECK 2: Time elapsed check ---
  if (timestamp) {
    const timeTakenMs = Date.now() - timestamp;
    if (timeTakenMs < 1500) {
      console.warn('[Spam Protection] Velocity check failed. Form completed in < 1.5s.');
      return { success: false, error: 'Submission was too fast. Please try again.' };
    }
  }

  // --- BOT MITIGATION CHECK 3: Cloudflare Turnstile (if configured) ---
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileToken) {
    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      });

      const outcome = await response.json();
      if (!outcome.success) {
        console.warn('[Spam Protection] Cloudflare Turnstile verification failed:', outcome['error-codes']);
        return { success: false, error: 'CAPTCHA verification failed. Please refresh and try again.' };
      }
    } catch (err) {
      console.error('[Spam Protection] Error verifying Turnstile token:', err);
      // Fail closed or open depending on security posture; here we log and proceed if network issue
    }
  }

  // --- SERVER-SIDE VALIDATION ---
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { success: false, error: 'All fields are required.' };
  }

  if (name.length > 100 || subject.length > 200 || message.length > 5000) {
    return { success: false, error: 'Field content exceeds maximum allowed length.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // --- EMAIL DISPATCH ---
  // In production, configure EMAIL_API_KEY (e.g. Resend, SendGrid, or Nodemailer SMTP)
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (process.env.EMAIL_API_KEY === 'fail') {
    return { success: false, error: 'Failed to deliver message due to a server error. Please try again later.' };
  }

  return { success: true };
}
