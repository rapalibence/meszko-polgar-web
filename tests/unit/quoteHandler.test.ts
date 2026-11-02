import { describe, expect, it, vi } from 'vitest';
import handler from '../../api/quote';

function mockRes() {
  const res: any = { statusCode: 200, body: undefined as unknown };
  res.status = (c: number) => { res.statusCode = c; return res; };
  res.json = (b: unknown) => { res.body = b; return res; };
  res.setHeader = () => res;
  return res;
}

const valid = {
  name: 'Kovács Ákos', company: '', phone: '06 30 123 4567', email: 'akos@example.hu',
  product: 'zuzottko-0-4', quantityT: 120, address: '', note: '', consent: true,
};

describe('api/quote', () => {
  it('rejects non-POST', async () => {
    const res = mockRes();
    await handler({ method: 'GET', body: undefined } as any, res);
    expect(res.statusCode).toBe(405);
  });
  it('returns 400 with errors for an invalid payload', async () => {
    const res = mockRes();
    await handler({ method: 'POST', body: { ...valid, phone: '1' } } as any, res);
    expect(res.statusCode).toBe(400);
    expect((res.body as any).errors).toBeTruthy();
  });
  it('logs the quote with UTF-8 intact and returns 200', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = mockRes();
    await handler({ method: 'POST', body: valid } as any, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(log.mock.calls.flat().join(' ')).toContain('Kovács Ákos');
    log.mockRestore();
  });
});
