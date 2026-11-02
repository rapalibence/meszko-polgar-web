export type ProcessStep = {
  slug: string;
  title: string;
  body: string;
  /** Short factual tag shown next to the step number. */
  meta: string;
};

export const processSteps: ProcessStep[] = [
  { slug: 'jovesztes', title: 'Jövesztés', body: 'Robbantással és bontással termeljük ki a kőzetet a székesfehérvári bányatelken, környezetvédelmi működési engedély alapján.', meta: '7 terasz' },
  { slug: 'tores', title: 'Törés', body: 'A tömböket pofás és kúpos törőkkel aprítjuk a kívánt szemcseméretre.', meta: 'pofás + kúpos törő' },
  { slug: 'osztalyozas', title: 'Osztályozás', body: 'Vibrációs rostákon válogatjuk szét a frakciókat, hogy minden depó egynemű legyen.', meta: '6 frakció' },
  { slug: 'merlegeles', title: 'Mérlegelés', body: 'Hitelesített hídmérlegen mérjük a rakományt. Pontos tonna, pontos számla.', meta: 'hitelesített hídmérleg' },
  { slug: 'szallitas', title: 'Szállítás', body: 'Saját és partneri billencsekkel visszük Fejér vármegyébe és Budapest térségébe, digitális szállítólevéllel.', meta: '[60] km-es körzet' },
];
