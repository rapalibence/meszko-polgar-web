import { z } from 'zod';
import { products } from '../content/products';

export const REQUIRED = 'Kötelező mező';
export const INVALID_EMAIL = 'Érvénytelen e-mail-cím';
export const INVALID_PHONE = 'Érvénytelen telefonszám';
export const CONSENT_REQUIRED = 'El kell fogadnia az adatkezelési tájékoztatót';

const PHONE = /^(\+36|06)[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}$/;
const productSlugs = ['egyeb', ...products.map((p) => p.slug)] as [string, ...string[]];

export const quoteSchema = z.object({
  name: z.string().trim().min(2, REQUIRED),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  phone: z.string().trim().min(1, REQUIRED).regex(PHONE, INVALID_PHONE),
  email: z.string().trim().min(1, REQUIRED).email(INVALID_EMAIL),
  product: z.enum(productSlugs, { message: REQUIRED }),
  quantityT: z.coerce.number().min(1).optional().or(z.literal('')),
  address: z.string().trim().max(200).optional().or(z.literal('')),
  note: z.string().trim().max(1000).optional().or(z.literal('')),
  consent: z.literal(true, { message: CONSENT_REQUIRED }),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type Quote = z.output<typeof quoteSchema>;
