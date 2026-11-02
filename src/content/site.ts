export type IconName = 'MapPin' | 'Phone' | 'Envelope' | 'Clock';

export const site = {
  brand: 'MÉSZKŐ POLGÁR',
  brandSuffix: 'Kft.',
  nav: [
    { label: 'Termékek', href: '#termekek' },
    { label: 'Szolgáltatások', href: '#szolgaltatasok' },
    { label: 'Rólunk', href: '#rolunk' },
    { label: 'Kapcsolat', href: '#kapcsolat' },
  ],
  cta: 'Ajánlatkérés',
  hero: {
    label: 'Székesfehérvár III. és IV. bányatelek',
    h1: 'Zúzottkő és útalap, közvetlenül a székesfehérvári bányából.',
    cards: [
      { label: 'Termékek', href: '#termekek', photo: '/photo/frac-8-16.webp', alt: 'Zúzottkő frakció közelről' },
      { label: 'Szolgáltatások', href: '#szolgaltatasok', photo: '/photo/loading.webp', alt: 'Rakodógép tölti a billencset' },
    ],
    sub: 'Minőségi kőanyag útépítéshez, betongyártáshoz és tereprendezéshez. Saját rakodás, hitelesített mérlegelés, rövid határidő.',
    secondary: 'Termékek',
    data: ['7 terasz', '14 m mélység', 'Székesfehérvár III. és IV. bányatelek'],
    proof: ['Hitelesített hídmérleg', 'Környezetvédelmi működési engedély'],
  },
  figures: [
    { value: '2011', label: 'óta a piacon', numeric: 2011 },
    { value: '[200 000]', label: 'tonna éves kapacitás', numeric: null },
    { value: '[60]', label: 'km-es szállítási körzet', numeric: null },
    { value: '7', label: 'terasz', numeric: 7 },
    { value: '14 m', label: 'bányamélység', numeric: null },
  ],
  about: {
    h2: 'Székesfehérvári bánya, helyi csapat, több mint egy évtized.',
    body: 'A Mészkő Polgár Kft. 2011 óta foglalkozik kőbányászattal és kőanyag-értékesítéssel. Telephelyünk Székesfehérvár keleti határában, a Budai út felől közelíthető meg, percekre az M7-es autópályától. Célunk egyszerű: megbízható minőség, pontos mennyiség, tartható határidő.',
    facts: [
      'Hitelesített hídmérleg',
      'Környezetvédelmi működési engedély',
      'Tájrendezési terv szerinti művelés',
      '[CE / minőségi tanúsítvány]',
    ],
    photo: '/photo/hero-quarry.webp',
  },
  process: {
    h2: 'A kőtől a fuvarig',
    sub: 'Öt lépés, egy telephelyen. Minden tonna mérve, minden fuvar dokumentálva.',
  },
  thanks: {
    h1: 'Köszönjük, megkaptuk.',
    body: 'Egy munkanapon belül válaszolunk az ajánlatkérésre. Sürgős esetben hívjon minket a megadott telefonszámon.',
    back: 'Vissza a főoldalra',
  },
  notFound: {
    h1: 'Ez az oldal nem létezik.',
    body: 'Lehet, hogy a cím elgépelődött, vagy az oldal megszűnt. A főoldalon mindent megtalál.',
    back: 'Vissza a főoldalra',
  },
  menu: {
    open: 'Menü',
    close: 'Bezárás',
  },
  footer_credit: 'Fotók: Unsplash (ideiglenes, a saját fotókig).',
  products: {
    h2: 'Frakciók és felhasználás',
    intro: 'Az alábbi frakciók érhetők el a telephelyen. Egyedi igénnyel keressen minket.',
    outro:
      'Kiszerelés: ömlesztve, tehergépkocsira rakva a telephelyen, vagy házhoz szállítva. Mennyiségi kedvezmény 100 tonna felett.',
  },
  faq: {
    h2: 'Gyakori kérdések',
    items: [
      { q: 'Mekkora a minimális rendelhető mennyiség?', a: 'Telephelyi átvételnél nincs alsó határ, a saját utánfutótól a nyerges szerelvényig bármit megrakunk. Kiszállításnál a legkisebb egység egy billencs rakománya, jellemzően [12-25] tonna.' },
      { q: 'Hova szállítanak és mennyi idő alatt?', a: 'Fejér vármegyébe és Budapest térségébe, nagyjából [60] km-es körzetben. Szabad kapacitás esetén másnapra, egyébként 2-3 munkanapon belül.' },
      { q: 'Hogyan történik a mérés és a számlázás?', a: 'Hitelesített hídmérlegen mérünk, a rakományhoz digitális szállítólevél készül. A számla a mért tonnára készül, nem becslésre.' },
      { q: 'Milyen frakciók és milyen célra kaphatók?', a: '0/4, 4/8, 8/16, 16/32 zúzottkő, 0/32 zúzott útalap és terméskő. Útalapnak, betonadaléknak, drénrétegnek, gabionhoz és tereprendezéshez.' },
      { q: 'Mikor lehet rakodni és hogyan fizethetek?', a: 'Hétköznap 6:00 és 16:00 között. Fizetés [átutalással, előre utalással vagy a helyszínen bankkártyával]; a részleteket az ajánlattal együtt küldjük.' },
    ],
  },
  contact: {
    h2: 'Ajánlatkérés',
    sub: 'Írja meg, milyen frakcióra, mennyiségre és hova kéri. Egy munkanapon belül válaszolunk.',
    promise: 'Válasz egy munkanapon belül',
    directions: 'Útvonalterv',
    rows: [
      { icon: 'MapPin' as IconName, label: 'Telephely', value: '[Székesfehérvár, Budai út felől, pontos cím]' },
      { icon: 'Phone' as IconName, label: 'Telefon', value: '[+36 xx xxx xxxx]' },
      { icon: 'Envelope' as IconName, label: 'E-mail', value: '[info@meszko.com]' },
      { icon: 'Clock' as IconName, label: 'Nyitvatartás', value: 'hétfő-péntek 6:00-16:00' },
    ],
    mapCenter: [47.19, 18.46] as [number, number],
    form: {
      name: 'Név',
      company: 'Cég',
      phone: 'Telefon',
      email: 'E-mail',
      product: 'Termék / frakció',
      productPlaceholder: 'Válasszon',
      productOther: 'Egyéb',
      quantity: 'Mennyiség (tonna)',
      address: 'Szállítási cím',
      note: 'Megjegyzés',
      consent: 'Elfogadom az adatkezelési tájékoztatót',
      submitting: 'Küldés...',
      success: 'Köszönjük! Egy munkanapon belül jelentkezünk.',
      failure: 'Hiba történt, próbálja újra.',
    },
  },
  footer: {
    legal: 'Székhely: [placeholder] · Adószám: [placeholder] · Cégjegyzékszám: [placeholder]',
    links: [
      { label: 'Adatkezelési tájékoztató', href: '/adatkezeles' },
      { label: 'Impresszum', href: '/impresszum' },
    ],
    copyright: '© 2026 Mészkő Polgár Kft. Minden jog fenntartva.',
  },
  meta: {
    title: 'Mészkő Polgár Kft. | Zúzottkő és kőanyag Székesfehérvárról',
    description:
      'Zúzottkő, útalap és terméskő közvetlenül a székesfehérvári bányából. Saját rakodás, hitelesített hídmérleg, szállítás Fejér vármegyébe és Budapestre.',
  },
} as const;
