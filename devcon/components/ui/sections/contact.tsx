'use client';

import { useState, useEffect, useRef } from 'react';
import { submitContact } from '@/app/actions/contact';
import Button from '@/components/ui/button';
import SocialMedia from '@/components/ui/sections/social-media';
import { siteConfig } from '@/lib/site-config';
import { useTheme } from 'next-themes';

/**
 * Contact — Dedicated Contact section/page for DevCon Laguna.
 *
 * ## Map Implementation Architecture & Decisions:
 * - **Choice: Interactive Sandboxed Embed (`/map.html`) vs Static Map Image:**
 *   An interactive embed powered by Leaflet and public OpenStreetMap tiles was chosen over
 *   a static image or vendor SDK for the following reasons:
 *   1. **Zero Client Secrets**: No third-party API keys (e.g. Mapbox, Google Maps) are exposed on the client.
 *   2. **Zero Runtime Dependencies**: Avoids bulky bundle overhead and React 19 peer-dependency conflicts.
 *   3. **Theme & Retina Responsiveness**: Seamlessly syncs between Light (clean grayscale) and Dark (inverted charcoal)
 *      via CSS filters and parent-theme synchronization without downloading new static assets.
 *   4. **Scroll & Mobile Friendliness**: Disables scroll-wheel hijacking on mobile while preserving touch panning.
 *
 * ## Bot & Spam Mitigation (SRS FR-11):
 * - Hidden Honeypot Field (`company_website`): Invisible to legitimate users; traps automated bot scrapers.
 * - Form Velocity Validation: Tracks render-to-submission delta to reject superhuman bot submissions (< 1.5s).
 * - Optional Cloudflare Turnstile: Supported through environment variable configuration.
 */
export default function Contact() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Bot mitigation: capture timestamp when form mounted
  const formLoadTimestamp = useRef<number | null>(null);
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Hidden honeypot field
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    formLoadTimestamp.current = Date.now();
  }, []);

  useEffect(() => {
    if (mapIframeRef.current && mapIframeRef.current.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage(
        { type: 'THEME_CHANGE', theme: resolvedTheme },
        '*'
      );
    }
  }, [resolvedTheme]);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Please enter a subject or topic';
    if (!formData.message.trim()) errors.message = 'Please enter your message';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData.honeypot,
        timestamp: formLoadTimestamp.current ?? undefined,
      });

      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(response.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto py-12 lg:py-20 px-6 lg:px-12 w-full">
      <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 w-full">
        {/* Left Column: Organization Details & Map */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <span className="text-base sm:text-lg font-mono tracking-wide text-devcon-lime-500 mb-2">
            {'// GET IN TOUCH WITH THE COMMUNITY'}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            GET IN TOUCH.
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-foreground/90 mb-12 max-w-md">
            Have questions about the upcoming DevCon? Want to speak, sponsor, or volunteer? Drop us a line and our core team will reach back out.
          </p>

          <div className="flex flex-col gap-8 mb-12">
            <div>
              <span className="text-xs font-mono tracking-wide text-foreground/60 uppercase mb-2 block">
                {'// EMAIL DIRECT'}
              </span>
              <a href={`mailto:${siteConfig.email}`} className="text-xl sm:text-2xl font-bold text-foreground hover:text-devcon-lime-500 transition-colors">
                {siteConfig.email}
              </a>
            </div>

            <div>
              <span className="text-xs font-mono tracking-wide text-foreground/60 uppercase mb-2 block">
                {'// COMMUNITY HUB'}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                Laguna, Philippines
              </p>
            </div>

            <div>
              <span className="text-xs font-mono tracking-wide text-foreground/60 uppercase mb-2 block">
                {'// NETWORK SIGNALS'}
              </span>
              <SocialMedia color="text-devcon-lime-500" />
            </div>
          </div>

          {/* Interactive Map Panel */}
          <div className="w-full h-48 sm:h-64 lg:h-72 rounded-[32px] overflow-hidden bg-surface border border-border relative shadow-sm">
            {mounted && (
              <iframe
                ref={mapIframeRef}
                src={`/map.html?theme=${resolvedTheme === 'dark' ? 'dark' : 'light'}`}
                className="w-full h-full border-0 transition-opacity duration-500"
                title="DevCon Laguna Community Hub Map"
                aria-label="Map showing DevCon Laguna physical community hub in Laguna, Philippines"
                loading="lazy"
              ></iframe>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full lg:w-7/12 flex flex-col pt-2 lg:pt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {/* Honeypot anti-spam field (hidden from assistive tech and visual display) */}
            <div className="hidden opacity-0 -z-50 absolute pointer-events-none" aria-hidden="true">
              <label htmlFor="company_website">Company Website</label>
              <input
                type="text"
                id="company_website"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-mono tracking-[0.1em] text-foreground uppercase">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Wonwoo"
                className={`w-full bg-transparent border ${fieldErrors.name ? 'border-devcon-orange-500' : 'border-border focus:border-foreground'} outline-none px-4 py-3 text-base font-sans text-foreground placeholder:text-foreground/40 transition-colors`}
                disabled={status === 'submitting' || status === 'success'}
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name && (
                <p className="text-xs font-mono text-devcon-orange-500 flex items-center gap-1 mt-1" role="alert">
                  <span aria-hidden>ⓘ</span> {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-mono tracking-[0.1em] text-foreground uppercase">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="invalid-email-address"
                className={`w-full bg-transparent border ${fieldErrors.email ? 'border-devcon-orange-500' : 'border-border focus:border-foreground'} outline-none px-4 py-3 text-base font-sans text-foreground placeholder:text-foreground/40 transition-colors`}
                disabled={status === 'submitting' || status === 'success'}
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="text-xs font-mono text-devcon-orange-500 flex items-center gap-1 mt-1" role="alert">
                  <span aria-hidden>ⓘ</span> {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-xs font-mono tracking-[0.1em] text-foreground uppercase">
                Subject / Topic
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What are we talking about?"
                className={`w-full bg-transparent border ${fieldErrors.subject ? 'border-devcon-orange-500' : 'border-border focus:border-foreground'} outline-none px-4 py-3 text-base font-sans text-foreground placeholder:text-foreground/40 transition-colors`}
                disabled={status === 'submitting' || status === 'success'}
                aria-invalid={!!fieldErrors.subject}
              />
              {fieldErrors.subject && (
                <p className="text-xs font-mono text-devcon-orange-500 flex items-center gap-1 mt-1" role="alert">
                  <span aria-hidden>ⓘ</span> {fieldErrors.subject}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label htmlFor="message" className="text-xs font-mono tracking-[0.1em] text-foreground uppercase">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us details about your speaking proposal, sponsor interests, or community inquiries.."
                rows={5}
                className={`w-full bg-transparent border ${fieldErrors.message ? 'border-devcon-orange-500' : 'border-border focus:border-foreground'} outline-none px-4 py-3 text-base font-sans text-foreground placeholder:text-foreground/40 transition-colors resize-y min-h-[120px]`}
                disabled={status === 'submitting' || status === 'success'}
                aria-invalid={!!fieldErrors.message}
              />
              {fieldErrors.message && (
                <p className="text-xs font-mono text-devcon-orange-500 flex items-center gap-1 mt-1" role="alert">
                  <span aria-hidden>ⓘ</span> {fieldErrors.message}
                </p>
              )}
            </div>

            {status === 'error' && errorMessage && (
              <div className="p-4 border border-devcon-orange-500 bg-devcon-orange-500/10 text-devcon-orange-500 text-sm font-sans" role="alert">
                {errorMessage}
              </div>
            )}

            {status === 'success' ? (
              <div className="p-4 border border-devcon-lime-500 rounded-xl bg-transparent flex items-center gap-3 mt-4" role="status" aria-live="polite">
                <div className="w-6 h-6 bg-devcon-lime-500 flex items-center justify-center rounded-sm shrink-0">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L12.5 1" stroke="#141416" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm sm:text-base font-sans font-bold text-foreground">
                  Your message has been sent successfully!
                </p>
              </div>
            ) : (
              <Button 
                type="submit"
                disabled={status === 'submitting'}
                label={status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'} 
                className="w-full mt-4 rounded-[32px] !py-4 uppercase tracking-widest text-sm"
                icon={null}
              />
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
