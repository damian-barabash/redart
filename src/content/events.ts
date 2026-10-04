export type EventItem = {
  slug: string
  /** ISO, do sortowania i <time> */
  date: string
  place: string
  title: string
  image?: string
  body?: string[]
}

export const events: EventItem[] = [
  {
    slug: 'izabela-trojanowska-hot-dance-party',
    date: '2019-09-07',
    place: 'Festiwal Łódź Czterech Kultur',
    title: 'Izabela Trojanowska – Hot Dance Party',
    image: 'eventy/hot-dance-party',
    body: [
      'To będzie niecodzienna muzyczna podróż w czasie do lat 80. i 90. oraz krainy wiecznych hitów. W ramach Festiwalu Łódź Czterech Kultur łódzki zespół KAMP! zaprasza do klubu Wytwórnia na HOT DANCE PARTY, czyli taneczne – i jak na KAMP! przystało – elektroniczne spotkanie poza granicami gatunków i pokoleń. Do współtworzenia projektu muzycy zaprosili znakomitych gości, którzy wraz z nimi na nowo zinterpretują generacyjne przeboje. Na jednej scenie wystąpią: Kev Fox, Kasia Lins, Hania Rani, Rosalie., Iza Trojanowska, Barbara Wrońska i Piotr Zioła.',
    ],
  },
  {
    slug: 'izabela-trojanowska-festiwal-optymizmu',
    date: '2019-08-20',
    place: 'Cukrownia Żnin',
    title: 'Izabela Trojanowska – Festiwal Optymizmu',
    image: 'eventy/festiwal-optymizmu',
    body: [
      'Zapraszamy Was na jedyny w swoim rodzaju Światowy Festiwal Optymizmu, którego nadrzędnym celem jest przekazywanie i wywołanie pozytywnych emocji wśród gości. Kulminacyjnym punktem Festiwalu będzie oficjalne wręczenie stypendiów uhonorowanych przez Fundację „Jestem Optymistą”, które zostaną przekazane młodym i utalentowanym Optymistom.',
      'Założyciel Fundacji oraz pomysłodawca wydarzenia – Mariusz Pujszo przypomina, że „Naszym celem jest szerzenie optymizmu poprzez promocję postaw optymistycznych, pozytywnego myślenia i radości życia, życzliwego stosunku do ludzi i otoczenia, otwartości i społecznej aktywności na rzecz szeroko rozumianej „zmiany na lepsze”. Chcemy pobudzić ludzi w Polsce i na świecie do pozytywnego myślenia. Zarażamy uśmiechem!',
    ],
  },
  {
    slug: 'top-of-the-top-sopot-festival-izabela-trojanowska',
    date: '2019-08-15',
    place: 'Sopot',
    title: 'Top of The Top Sopot Festival – Izabela Trojanowska',
    image: 'eventy/top-of-the-top-sopot',
    body: [
      'Izabela Trojanowska wystąpi podczas pierwszego dnia festiwalu, w ramach koncertu „Forever Young”. Twórczość Izabeli Trojanowskiej porywa kolejne pokolenia.',
    ],
  },
  {
    slug: 'polandrock-festiwal-majka-jezowska',
    date: '2019-08-03',
    place: 'Kostrzyn nad Odrą',
    title: 'Pol’and’Rock Festiwal – Majka Jeżowska',
    image: 'eventy/polandrock-majka-jezowska',
    body: [
      'Takiego koncertu ten festiwal nie widział! Spełniamy marzenia fanów młodszych i starszych, zapraszając na występ Majki Jeżowskiej 3 sierpnia o godz. 17:20 na Małej Scenie Pol’and’Rock Festival.',
    ],
  },
  { slug: 'majka-jezowska-koncert-5', date: '2018-12-08', place: 'Rybnik – rynek', title: 'Majka Jeżowska – koncert' },
  { slug: 'majka-jezowska-koncert-4', date: '2018-10-25', place: 'Lwówek Śląski (impreza zamknięta)', title: 'Majka Jeżowska – koncert' },
  { slug: 'majka-jezowska-koncert-3', date: '2018-10-20', place: 'Toruń – Centrum Park', title: 'Majka Jeżowska – koncert' },
  { slug: 'majka-jezowska-koncert-2', date: '2018-10-06', place: 'Kalisz – Park Przyjaźni', title: 'Majka Jeżowska – koncert' },
  { slug: 'majka-jezowska-koncert', date: '2018-09-15', place: 'Radzymin', title: 'Majka Jeżowska – koncert' },
]

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return { day: d, month: m, year: y, full: `${d}-${m}-${y}` }
}
