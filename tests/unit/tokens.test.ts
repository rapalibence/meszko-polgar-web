import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

describe('design tokens', () => {
  it('defines the accent, canvas and easing tokens exactly as specified', () => {
    expect(css).toContain('--accent: #E4561B');
    expect(css).toContain('--bg: #1A1816');
    expect(css).toContain('--ease: cubic-bezier(.23,1,.32,1)');
  });

  it('never uses pure white or pure black', () => {
    expect(css.toUpperCase()).not.toContain('#FFFFFF');
    expect(css.toUpperCase()).not.toContain('#000000');
  });
});
