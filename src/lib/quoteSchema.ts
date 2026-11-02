import { z } from 'zod';
import { products } from '../content/products.js';

export const REQUIRED = 'Kötelező mező';
export const INVALID_EMAIL = 'Érvénytelen e-mail-cím';
export const INVALID_PHONE = 'Érvénytelen telefonszám';
export const CONSENT_REQUIRED = 'El kell fogadnia az adatkezelési tájékoztatót';
export const MIN_NAME = 'Legalább 2 karakter';
export const MIN_QTY = 'Legalább 1 tonna';
export const MAX_NOTE = 'Legfeljebb 1000 karakter';
export const MAX_SHORT = 'Legfeljebb 200 karakter';

/** Accepts +36 / 06 / 0036 prefixes or none, with spaces, hyphens, slashes and brackets. */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-/().]/g, '');
}
const PHONE_DIGITS = /^(\+36|06|0036)?\d{8,9}$/;

const productSlugs = ['egyeb', ...products.map((p) => p.slug)] as [string, ...string[]];

const optionalText = (max: number, msg: string) =>
  z.string().trim().max(max, msg).optional().or(z.literal(''));

export const quoteSchema = z.object({
  name: z.string().trim().min(1, REQUIRED).min(2, MIN_NAME).max(120, MAX_SHORT),
  company: optionalText(120, MAX_SHORT),
  phone: z
    .string()
    .trim()
    .min(1, REQUIRED)
    .refine((v) => PHONE_DIGITS.test(normalizePhone(v)), INVALID_PHONE),
  email: z.string().trim().min(1, REQUIRED).email(INVALID_EMAIL),
  product: z.enum(productSlugs, { message: REQUIRED }),
  quantityT: z.union([z.literal(''), z.coerce.number().min(1, MIN_QTY)]).optional(),
  address: optionalText(200, MAX_SHORT),
  note: optionalText(1000, MAX_NOTE),
  consent: z.literal(true, { message: CONSENT_REQUIRED }),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type Quote = z.output<typeof quoteSchema>;
