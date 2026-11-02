import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('production bundle', () => {
  it('does not preload the three.js chunk from index.html', () => {
    const html = resolve(process.cwd(), 'dist/index.html');
    if (!existsSync(html)) return; // built in CI before tests
    const src = readFileSync(html, 'utf8');
    expect(src).not.toMatch(/modulepreload[^>]+three-/);
    expect(src).not.toMatch(/PitScene-/);
  });
});
