import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('production bundle', () => {
  it('ships no three.js in the site bundle (it is only used by the offline render page)', () => {
    const html = resolve(process.cwd(), 'dist/index.html');
    if (!existsSync(html)) return; // built in CI before tests
    const src = readFileSync(html, 'utf8');
    expect(src).not.toMatch(/three|frames\//);
    const assets = readdirSync(resolve(process.cwd(), 'dist/assets'));
    expect(assets.some((a) => /three|framer|render/.test(a))).toBe(false);
  });
});
