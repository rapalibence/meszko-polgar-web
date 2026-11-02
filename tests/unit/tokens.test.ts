import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

describe('design tokens', () => {
  it('defines the accent, canvas and easing tokens exactly as specified', () => {
    expect(css).toContain('--accent: #D9521A');
    expect(css).toContain('--bg: #F4F1EA');
    expect(css).toContain('--olive: #2A2A1E');
    expect(css).toContain('--ease: cubic-bezier(.23,1,.32,1)');
  });

  it('never uses pure white or pure black', () => {
    expect(css.toUpperCase()).not.toContain('#FFFFFF');
    expect(css.toUpperCase()).not.toContain('#000000');
  });
});
