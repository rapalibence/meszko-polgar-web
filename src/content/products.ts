export type Product = {
  slug: string;
  name: string;
  range: string;
  use: string;
  /** TODO: replace procedural placeholder with client photo. */
  photo: string;
  span: 'lg' | 'md' | 'sm';
};

export const products: Product[] = [
  { slug: 'zuzott-utalap-0-32', name: 'Zúzott útalap 0/32 (Z 0/32)', range: '0-32 mm', use: 'Útépítés, térburkolat alapja', photo: '/img/gravel-0-32.webp', span: 'lg' },
  { slug: 'zuzottko-0-4', name: 'Zúzottkő 0/4', range: '0-4 mm', use: 'Ágyazat, habarcs, kiegyenlítés', photo: '/img/gravel-0-4.webp', span: 'md' },
  { slug: 'zuzottko-4-8', name: 'Zúzottkő 4/8', range: '4-8 mm', use: 'Betonadalék, burkolat alá', photo: '/img/gravel-4-8.webp', span: 'md' },
  { slug: 'zuzottko-8-16', name: 'Zúzottkő 8/16', range: '8-16 mm', use: 'Beton, drénrétegek', photo: '/img/gravel-8-16.webp', span: 'md' },
  { slug: 'zuzottko-16-32', name: 'Zúzottkő 16/32', range: '16-32 mm', use: 'Útalap, szivárgó rétegek', photo: '/img/gravel-16-32.webp', span: 'md' },
  { slug: 'termesko', name: 'Terméskő, bányakő', range: 'vegyes', use: 'Támfal, gabion, tereprendezés', photo: '/img/boulders.webp', span: 'sm' },
];
