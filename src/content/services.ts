export const services = {
  h2: 'Nem csak követ adunk. Megoldást.',
  featured: {
    icon: 'FileCheck' as const,
    title: 'Digitális szállítólevél',
    body: 'Minden fuvarhoz elektronikus szállítólevél készül, amelyet az átvevő a helyszínen igazol. Átlátható, visszakereshető dokumentáció, papír nélkül.',
    photo: '/photo/weighbridge.webp',
  },
  rows: [
    { icon: 'Truck' as const, photo: '/photo/haul.webp', title: 'Szállítás', body: 'Egy- és többfuvaros megrendelést is vállalunk, akár másnapi kiszállítással a szabad kapacitás függvényében.' },
    { icon: 'Scales' as const, photo: '/photo/loading.webp', title: 'Rakodás a telephelyen', body: 'Rakodógépes felrakás, rövid várakozási idő. Nyitvatartás hétköznap 6-tól 16 óráig.' },
  ],
};
