import { describe, expect, it } from 'vitest';
import { site } from '../../src/content/site';
import { products } from '../../src/content/products';
import { processSteps } from '../../src/content/process';
import { services } from '../../src/content/services';

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe('content', () => {
  const all = [site, products, processSteps, services].flatMap((m) => strings(m));

  it('contains no em or en dashes', () => {
    const offenders = all.filter((s) => /[–—]/.test(s));
    expect(offenders).toEqual([]);
  });

  it('has six products with exactly one large tile', () => {
    expect(products).toHaveLength(6);
    expect(products.filter((p) => p.span === 'lg')).toHaveLength(1);
  });

  it('descends 12 m per process step', () => {
    expect(processSteps.every((s) => s.meta.length > 0)).toBe(true);
  });

  it('uses one CTA label and a hero sub of at most 20 words', () => {
    expect(site.cta).toBe('Ajánlatkérés');
    expect(site.hero.sub.split(/\s+/).length).toBeLessThanOrEqual(20);
    expect(site.hero.secondary).toBe('Termékek');
  });
});
