export type Product = {
  slug: string;
  name: string;
  range: string;
  use: string;
  photoSeed: string;
  span: 'lg' | 'md' | 'sm';
};

export const products: Product[] = [
  { slug: 'zuzott-utalap-0-32', name: 'Zúzott útalap 0/32 (Z 0/32)', range: '0-32 mm', use: 'Útépítés, térburkolat alapja', photoSeed: 'crushed-limestone-closeup', span: 'lg' },
  { slug: 'zuzottko-0-4', name: 'Zúzottkő 0/4', range: '0-4 mm', use: 'Ágyazat, habarcs, kiegyenlítés', photoSeed: 'gravel-0-4', span: 'md' },
  { slug: 'zuzottko-4-8', name: 'Zúzottkő 4/8', range: '4-8 mm', use: 'Betonadalék, burkolat alá', photoSeed: 'gravel-4-8', span: 'md' },
  { slug: 'zuzottko-8-16', name: 'Zúzottkő 8/16', range: '8-16 mm', use: 'Beton, drénrétegek', photoSeed: 'gravel-8-16', span: 'md' },
  { slug: 'zuzottko-16-32', name: 'Zúzottkő 16/32', range: '16-32 mm', use: 'Útalap, szivárgó rétegek', photoSeed: 'gravel-16-32', span: 'md' },
  { slug: 'termesko', name: 'Terméskő, bányakő', range: 'vegyes', use: 'Támfal, gabion, tereprendezés', photoSeed: 'quarry-boulders', span: 'sm' },
];
