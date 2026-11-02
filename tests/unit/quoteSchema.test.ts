import { describe, expect, it } from 'vitest';
import { quoteSchema } from '../../src/lib/quoteSchema';

const valid = {
  name: 'Kovács Ákos',
  company: '',
  phone: '06 30 123 4567',
  email: 'akos@example.hu',
  product: 'zuzottko-0-4',
  quantityT: 120,
  address: 'Székesfehérvár, Budai út 1.',
  note: '',
  consent: true,
};

function messages(result: ReturnType<typeof quoteSchema.safeParse>) {
  return result.success ? [] : result.error.issues.map((i) => i.message);
}

describe('quoteSchema', () => {
  it('accepts a Hungarian name and a domestic 06-prefixed phone number', () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects a short phone number', () => {
    expect(messages(quoteSchema.safeParse({ ...valid, phone: '1234' }))).toContain('Érvénytelen telefonszám');
  });
  it('requires consent', () => {
    expect(messages(quoteSchema.safeParse({ ...valid, consent: false }))).toContain('El kell fogadnia az adatkezelési tájékoztatót');
  });
  it('rejects an invalid e-mail', () => {
    expect(messages(quoteSchema.safeParse({ ...valid, email: 'x' }))).toContain('Érvénytelen e-mail-cím');
  });
  it('names required fields', () => {
    expect(messages(quoteSchema.safeParse({ ...valid, name: '' }))).toContain('Kötelező mező');
  });
});
