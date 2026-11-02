import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Contours } from '../../src/components/Contours';

describe('Contours', () => {
  it('renders seven drawable contour paths', () => {
    const html = renderToStaticMarkup(<Contours />);
    expect(html.match(/data-contour/g)?.length).toBe(7);
    expect(html).toContain('stroke="currentColor"');
  });
});
