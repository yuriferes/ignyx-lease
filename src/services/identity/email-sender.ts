import 'server-only';
import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'iGNYX Lease <noreply@ignyxlease.com.br>';
const REPLY_TO = process.env.RESEND_REPLY_TO;

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY não definido.');
  }
  _resend = new Resend(key);
  return _resend;
}

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
    replyTo: REPLY_TO,
  });
  if (error) {
    throw new Error(`Falha ao enviar e-mail: ${error.message}`);
  }
}
