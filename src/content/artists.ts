export type Artist = {
  slug: string
  name: string
  image: string
  wide: string
  excerpt: string
  bio: string[]
  links: { label: string; href: string }[]
  /** artysta bez własnej podstrony na stronie klienta — karta prowadzi na stronę zewnętrzną */
  external?: string
}

export const artists: Artist[] = [
  {
    slug: 'majka-jezowska',
    name: 'Majka Jeżowska',
    image: 'artysci/majka-jezowska',
    wide: 'artysci/majka-jezowska-wide',
    excerpt:
      'Wokalistka obdarzona ciepłym głosem i niezwykłym temperamentem estradowym, kompozytorka, autorka wielu przebojów i widowisk muzycznych.',
    bio: [
      'Majka Jeżowska – wokalistka obdarzona ciepłym głosem i niezwykłym temperamentem estradowym, kompozytorka, autorka wielu przebojów („Najpiękniejsza w klasie”, „Od rana mam dobry humor”, „Margarita”) i widowisk muzycznych („Majkowe studio nagrań”, „Kochaj czworonogi”), producent muzyczny oraz szefowa własnej firmy fonograficznej Ja-Majka Music.',
      'Ma na swoim koncie Platynową i kilka Złotych Płyt, wielokrotna laureatka KFPP w Opolu, zdobywczyni I nagrody Festiwalu Krajów Nadbałtyckich Karlsham, Kawaler Orderu Uśmiechu, Ambasador Dobrej Woli UNICEF-u, członek Rady Fundacji Ronalda McDonalda, wielka przyjaciółka dzieci i showmenka.',
      'Od wielu lat przyciąga na swoje familijne koncerty bardzo szeroką publiczność a na jej przebojach „A ja wolę moją mamę”, „Wszystkie dzieci nasze są”, „Kolorowe dzieci”, „Laleczka z saskiej porcelany” wychowuje się kolejne pokolenie wdzięcznych słuchaczy. Jako jedyna piosenkarka i autor muzyki ma swój Festiwal Piosenki „Rytm i melodia”, który odbywa się w Radomiu od 2006 roku.',
      'Repertuar Majki jest bardzo zróżnicowany – od piosenek familijnych poprzez występy na Piknikach Country w Mrągowie, w Telewizyjnych Biesiadach, Sylwestrowych Galach, Koncertach Wakacyjnych Przebojów, w nagraniach muzyki do filmów „King Size”, „Deja vu”, „Królestwo Zielonej Polany”, „W pustyni i w puszczy” i „Karolcia”.',
      'Majka ze swoją kolorową osobowością, wspaniałymi piosenkami, kontaktem z publicznością i humorem potrafi porwać do zabawy każdego widza, a jej koncert to okazja do wspólnego śpiewania, tańca i uśmiechu dla całej rodziny!',
    ],
    links: [
      { label: 'Strona www', href: 'http://www.majkajezowska.com.pl/' },
      { label: 'Facebook', href: 'https://www.facebook.com/majkajezowska/' },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCvnqAusFid9pHhEQ9N19pdA' },
    ],
  },
  {
    slug: 'izabela-trojanowska',
    name: 'Izabela Trojanowska',
    image: 'artysci/izabela-trojanowska-wide',
    wide: 'artysci/izabela-trojanowska-wide',
    excerpt: 'Twórczość Izabeli Trojanowskiej porywa kolejne pokolenia.',
    bio: [],
    links: [{ label: 'Strona www', href: 'http://www.izabelatrojanowska.pl' }],
    external: 'http://www.izabelatrojanowska.pl',
  },
  {
    slug: 'k-a-s-a',
    name: 'K.A.S.A.',
    image: 'artysci/k-a-s-a',
    wide: 'artysci/k-a-s-a-wide',
    excerpt:
      'Krzysztof K.A.S.A. Kasowski – wokalista, autor, kompozytor, aranżer oraz producent większości swoich nagrań oraz wideoklipów.',
    bio: [
      'Krzysztof K.A.S.A. Kasowski – wokalista, autor, kompozytor, aranżer oraz producent większości swoich nagrań oraz wideoklipów. Sprzedał łącznie ponad pół miliona płyt i zagrał blisko tysiąc koncertów w Polsce oraz w USA, Kanadzie, Niemczech, Irlandii oraz Australii. Znany z takich przebojów jak Piękniejsza, Maczo, Dżu-Dżu (Ja wierzę, że) Każdy Lubi Boogie, Seks i Kasa, Smak 80tych lat czy Powiedz Gdzie Jesteś.',
      'Jako pierwszy w Polsce samplował polskie nagrania z lat 80 tych (Kasa i Sex Maryli Rodowicz) oraz przeszczepił na nasz grunt takie gatunki jak raggamuffin (Reklama, Kasanova) czy merengue (Maczo). Jako jedyny inspiruje się takimi stylami muzycznymi jak soukous, soca, reggaeton, zouk, kizomba, bachata czy mazouk. Współpracował z Marylą Rodowicz, Andrzejem Piasecznym, Kasią Klich i Funky Filonem. W nagraniach i koncertach towarzyszyli mu muzycy z Kuby, Meksyku i Senegalu: Mariachi los Amigos, Rei Ceballo, Tony Junior, Mamadou Diouf, Pako Sarr – a także wybitni polscy muzycy jak Filip Sojka (Kayah, Edyta Górniak, Rafał Brzozowski), Robert Cichy (Ania Dąbrowska), Włodzimierz Kiniorski (Izrael) czy Wojciech Wójcicki (De Mono).',
      'Do swoich wideoklipów (łącznie ponad 10 mln odtworzeń na You Tube) zapraszał znanych aktorów i muzyków takich jak: Borys Szyc, Piotr Szwedes, Lidia Kopania, Dorota Naruszewicz, Wojciech Medyński, Andrzej Krzywy, Artur Gadowski, Paweł Stasiak, Kapitan Nemo czy Kabaret Skeczów Męczących.',
      'Kilkukrotnie nominowany do Fryderyka – w 1999 roku zdobył tę statuetkę w kategorii Najlepszy Album Roku (za płytę Kasa nr 3). Pisał felietony dla Machiny, Aktivista, Sukcesu i Gentlemana. Prowadził i współprowadził wiele programów telewizyjnych oraz festiwali muzycznych, między innymi Opolskie SuperJedynki, Bulwar Gwiazd, Big Star Party czy polskie eliminacje do Eurowizji. Był też kilkukrotnie polskim jurorem tego ostatniego festiwalu. Jest również autorem kontrowersyjnej powieści pt. „Kontrakt” o polskim show-biznesie widzianym z perspektywy debiutanta bez układów i znajomości.',
      'W 2017 roku powrócił z kilkoma nowymi piosenkami i teledyskami: Życiem się Cieszę, Znałem Ciebie czy Zostań Jeszcze Chwilę, był też bohaterem programu Kulisy Sławy w TVN. W 2018 roku jego utwór pt. Piasek zakwalifikował się do koncertu Premier na 55 Festiwalu Piosenki Polskiej w Opolu, jako jedna z dziewięciu propozycji na prawie dwieście zgłoszonych. Do piosenki powstał zabawny klip w którym zagrała popularna aktorka Joanna Majstrak.',
    ],
    links: [
      { label: 'Strona www', href: 'http://www.kasa.com.pl/' },
      { label: 'Facebook', href: 'https://www.facebook.com/K.A.S.A.Offcial/' },
      { label: 'YouTube', href: 'https://www.youtube.com/user/KASOWER' },
    ],
  },
  {
    slug: 'agnieszka-wiechnik',
    name: 'Agnieszka Wiechnik',
    image: 'artysci/agnieszka-wiechnik',
    wide: 'artysci/agnieszka-wiechnik-wide',
    excerpt:
      'Wokalistka, songwriterka, która współpracowała między innymi z Beatą Kozidrak, Braćmi Cugowskimi, Majką Jeżowską i Izabelą Trojanowską.',
    bio: [
      'Wokalistka, songwriterka, która współpracowała między innymi z Beatą Kozidrak, Braćmi Cugowskimi, Krzysztofem Cugowskim, Majką Jeżowską, Piotrem Kupichą, Wandą Kwietniewską, Andrzejem Krzywym, Izabelą Trojanowską, Łukaszem Zagrobelnym, Kasią Cerekwicką, Arturem Gadowskim, Sławkiem Uniatowskim, Natalią Sikorą, Markiem Piekarczykiem, Jackiem Zielińskim (Skaldowie), Kubą Badachem i innymi. Użyczyła swojego głosu w chórku na płycie CUGOWSCY „Zaklęty Krąg”.',
      'Uczestniczka takich programów jak Bitwa Na Głosy TVP (Drużyna Beaty Kozidrak) czy Must Be The Music 11, gdzie dostała 4 x TAK. Startowała do krajowych eliminacji Eurowizji z piosenką „Liar”. Zdobywczyni „SCYZORYKA” w kategorii Najlepszy Przebój za piosenkę „Ostatni raz” na Kieleckim Ogólnopolskim Festiwalu „Scyzoryki”. Szerszej publiczności dała się poznać dzięki świątecznemu przebojowi „Idą święta” oraz singlowi „Marionetka”. Oba te utwory rozbrzmiewały w ogólnopolskich stacjach radiowych. Ponadto jest współkompozytorką i autorką tekstu utworu POLSCY ARTYŚCI DZIECIOM „Za chwilę święta”, w którym wystąpiły polskie gwiazdy takie jak Majka Jeżowska, Wanda Kwietniewska, Marek Piekarczyk, Jacek Zieliński czy Piotr Kupicha, a cały dochód z piosenki został przeznaczony na podopiecznych Fundacji Jana Zamoyskiego.',
      'Prywatnie miłośniczka zwierząt, w szczególności buldożków, sama jest posiadaczką bulwy o imieniu Maniek, z którym się nie rozstaje. Świetnie sprawdza się jako konferansjer, scena to jej drugi dom. Lubi pracować z dziećmi i młodzieżą, jest trenerem wokalnym.',
    ],
    links: [
      { label: 'Strona www', href: 'http://www.agnieszkawiechnik.pl/' },
      { label: 'Facebook', href: 'https://www.facebook.com/agnieszkawiechnikfanpage/' },
      { label: 'Instagram', href: 'https://www.instagram.com/wiechnikagnieszka/?hl=pl' },
    ],
  },
]
