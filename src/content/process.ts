export type ProcessStep = {
  slug: string;
  title: string;
  body: string;
  photoSeed: string;
  depthM: number;
};

export const processSteps: ProcessStep[] = [
  { slug: 'jovesztes', title: 'Jövesztés', body: 'Robbantással és bontással termeljük ki a kőzetet a székesfehérvári bányatelken, környezetvédelmi működési engedély alapján.', photoSeed: 'quarry-blast-face', depthM: 0 },
  { slug: 'tores', title: 'Törés', body: 'A tömböket pofás és kúpos törőkkel aprítjuk a kívánt szemcseméretre.', photoSeed: 'rock-crusher-machine', depthM: 12 },
  { slug: 'osztalyozas', title: 'Osztályozás', body: 'Vibrációs rostákon válogatjuk szét a frakciókat, hogy minden depó egynemű legyen.', photoSeed: 'aggregate-screening-plant', depthM: 24 },
  { slug: 'merlegeles', title: 'Mérlegelés', body: 'Hitelesített hídmérlegen mérjük a rakományt. Pontos tonna, pontos számla.', photoSeed: 'truck-weighbridge', depthM: 36 },
  { slug: 'szallitas', title: 'Szállítás', body: 'Saját és partneri billencsekkel visszük Fejér vármegyébe és Budapest térségébe, digitális szállítólevéllel.', photoSeed: 'dump-truck-highway', depthM: 48 },
];
