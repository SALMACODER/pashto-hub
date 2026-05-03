/**
 * Email service — single nodemailer entry point.
 *
 * Configure via env vars:
 *   SMTP_HOST       smtp.gmail.com / smtp.sendgrid.net / etc.
 *   SMTP_PORT       587 (STARTTLS) or 465 (SSL)
 *   SMTP_USER       SMTP username
 *   SMTP_PASS       SMTP password / app-specific password / API key
 *   SMTP_FROM       From: header, e.g. "PashtoHub <[email protected]>"
 *
 * If SMTP_HOST is missing the service runs in **console mode** — every
 * outgoing email is logged to the server console instead of being sent.
 * This keeps local development working when you don't have an SMTP relay,
 * AND keeps the password-reset flow usable: you can copy the link from
 * the console output instead of waiting for an email. NEVER ship to
 * production without SMTP_HOST set.
 */

const nodemailer = require('nodemailer');

let cachedTransport = null;

const getTransport = () => {
  if (cachedTransport !== null) return cachedTransport;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) {
    console.warn('[email] SMTP_HOST not set — running in console-only mode (emails logged, not sent).');
    cachedTransport = false;                    // sentinel: console mode
    return cachedTransport;
  }

  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,          // true for 465 (SSL), false for 587 (STARTTLS)
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  cachedTransport.verify((err) => {
    if (err) console.error('[email] SMTP transport verification failed:', err.message);
    else     console.log(`[email] SMTP transport ready (${SMTP_HOST}:${SMTP_PORT || 587})`);
  });

  return cachedTransport;
};

const FROM = process.env.SMTP_FROM || 'PashtoHub <[email protected]>';

/**
 * Send (or log) one email. Resolves on success; rejects on transport error.
 * In console mode this never rejects — it always "succeeds" by logging.
 */
const sendMail = async ({ to, subject, html, text }) => {
  if (!to) throw new Error('sendMail: `to` is required');

  const transport = getTransport();
  if (transport === false) {
    console.log('────── [email] simulated send ──────');
    console.log(`From:    ${FROM}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`\n${text}\n`);
    console.log('────────────────────────────────────');
    return { simulated: true };
  }

  return transport.sendMail({ from: FROM, to, subject, html, text });
};

/**
 * Build the password-reset email body. Kept here so the controller stays focused
 * on flow control. Plain text fallback is included for clients that strip HTML.
 */
const buildResetEmail = ({ name, resetUrl }) => {
  const greeting = name ? `Hi ${name},` : 'Hello,';
  const text = [
    greeting,
    '',
    'You (or someone using your email) requested a password reset for your PashtoHub account.',
    '',
    'Open this link to set a new password (valid for 1 hour):',
    resetUrl,
    '',
    'If you didn’t request this, you can safely ignore this email — your password will stay the same.',
    '',
    '— PashtoHub',
  ].join('\n');

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Reset your PashtoHub password</h1>
      <p style="color: #444; line-height: 1.5;">${greeting}</p>
      <p style="color: #444; line-height: 1.5;">
        You (or someone using your email) requested a password reset.
        Click the button below to choose a new password.
        This link expires in <strong>1 hour</strong>.
      </p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; background: #2c7235; color: #fff; text-decoration: none;
                  padding: 12px 22px; border-radius: 8px; font-weight: 600;">
          Reset password
        </a>
      </p>
      <p style="color: #777; font-size: 13px; line-height: 1.5;">
        If the button doesn’t work, copy this URL into your browser:<br>
        <span style="word-break: break-all;">${resetUrl}</span>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="color: #999; font-size: 12px; line-height: 1.5;">
        Didn’t request this? You can safely ignore this email — your password
        will stay the same. The link expires automatically.
      </p>
    </div>
  `;

  return { text, html };
};

module.exports = { sendMail, buildResetEmail };
