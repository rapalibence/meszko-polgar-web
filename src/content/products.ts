export type Product = {
  slug: string;
  name: string;
  range: string;
  use: string;
  /** Unsplash placeholder until the client's own photos arrive (see public/photo/CREDITS.json). */
  photo: string;
  span: 'lg' | 'md' | 'sm';
};

export const products: Product[] = [
  { slug: 'zuzott-utalap-0-32', name: 'Zúzott útalap 0/32 (Z 0/32)', range: '0-32 mm', use: 'Útépítés, térburkolat alapja', photo: '/photo/frac-0-32.webp', span: 'lg' },
  { slug: 'zuzottko-0-4', name: 'Zúzottkő 0/4', range: '0-4 mm', use: 'Ágyazat, habarcs, kiegyenlítés', photo: '/photo/frac-0-4.webp', span: 'md' },
  { slug: 'zuzottko-4-8', name: 'Zúzottkő 4/8', range: '4-8 mm', use: 'Betonadalék, burkolat alá', photo: '/photo/frac-4-8.webp', span: 'md' },
  { slug: 'zuzottko-8-16', name: 'Zúzottkő 8/16', range: '8-16 mm', use: 'Beton, drénrétegek', photo: '/photo/frac-8-16.webp', span: 'md' },
  { slug: 'zuzottko-16-32', name: 'Zúzottkő 16/32', range: '16-32 mm', use: 'Útalap, szivárgó rétegek', photo: '/photo/frac-16-32.webp', span: 'md' },
  { slug: 'termesko', name: 'Terméskő, bányakő', range: 'vegyes', use: 'Támfal, gabion, tereprendezés', photo: '/photo/boulders.webp', span: 'sm' },
];
