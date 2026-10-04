// Treści przeniesione 1:1 ze strony klienta (redart.com.pl). Docelowo źródłem będzie Supabase (CMS).

export const site = {
  name: 'redART Events',
  legalName: 'redART EVENTS Rafał Wilczyński',
  tagline: 'Profesjonalna organizacja wydarzeń artystycznych',
  since: 1996,
  email: 'redart@redart.com.pl',
  www: 'www.redart.com.pl',
  facebook: 'https://www.facebook.com/redartevents/',
  contacts: [
    { role: 'Management', name: null, phone: '+48 604 755 510' },
    { role: null, name: 'Rafał Wilczyński', phone: '+48 602 699 510' },
    { role: 'Manager booking', name: 'Elżbieta Wilczyńska', phone: '+48 602 699 510' },
  ],
}

export const nav = [
  { to: '/o-nas', label: 'redART' },
  { to: '/artysci', label: 'Artyści' },
  { to: '/eventy', label: 'Eventy' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/rental', label: 'Rental' },
  { to: '/kontakt', label: 'Kontakt' },
]

export const about = {
  lead: 'Od 1996 roku działamy nieprzerwanie na rynku muzycznym w Polsce, co zaowocowało szerokim wachlarzem doświadczeń. Żadne działania marketingowo-eventowe nie są nam obce.',
  body: 'Przez te 20 lat wykonaliśmy tysiące pomyślnych realizacji: dni miast, tras koncertowych, festiwali, produkcji telewizyjnych, kampanii politycznych, koncertów biletowanych.',
  scope: ['Dni miast', 'Trasy koncertowe', 'Festiwale', 'Produkcje telewizyjne', 'Kampanie polityczne', 'Koncerty biletowane'],
}

export const rentalTeaser = {
  title: 'Wypożyczanie sprzętu scenicznego',
  lines: ['Wysokiej klasy sprzęt, gwarancja doskonałej jakości brzmienia.', 'Od małych, lokalnych wydarzeń po duże koncerty i imprezy masowe.'],
}

// Projekt KPO — treść ze strony „O nas”
export const kpo = {
  intro:
    'Firma redART EVENTS Rafał Wilczyński realizuje przedsięwzięcie MŚP pn. „Dywersyfikacja i uodpornienie na przyszłe kryzysy firmy redART EVENTS działającej w regionie łódzkim”.',
  goal: 'Celem przedsięwzięcia projektowego jest dywersyfikacja działalności oraz uodpornienie na przyszłe kryzysy firmy Redart Events poprzez wejście na nowe rynki w branży HoReCa w postaci kompleksowej organizacji wydarzeń typu targi, wystawy, kongresy dla klienta biznesowego od 01.2026r. w wyniku inwestycji w bazę usługową, transformację cyfrową.',
  tasksLead: 'Cel zostanie osiągnięty poprzez realizację następujących zadań:',
  tasks: ['Zadanie nr 1 – Inwestycja w bazę usługową'],
  groups:
    'Grupy docelowe: Projekt skierowany jest do MŚP z sektora HoReCa, turystyka lub kultura. Z projektu skorzysta Beneficjent – firma redART EVENTS Rafał Wilczyński.',
  effectsLead:
    'Realizacja przedsięwzięcia przyczyni się do zwiększenia odporności Wnioskodawcy na przyszłe sytuacje kryzysowe, rozszerzy prowadzoną działalność, zwiększy grupy potencjalnych klientów, zwiększy produktywność firmy i zwiększy jej konkurencyjność na rynku w dłuższej perspektywie. Dzięki realizacji przedsięwzięcia:',
  effects: [
    'Powstaną nowe usługi w postaci organizacji targów, wystaw i kongresów dla klienta biznesowego.',
    'Firma pozyska nowych klientów. Będą to klienci biznesowi zainteresowani organizacją targów, wystaw, kongresów w miejscu przez ich wyznaczonych. Będą to osoby, do których do tej pory nie kierowana była oferta.',
    'Podniesienie możliwości sprzedażowych firmy a w czasie np. reżimu sanitarnego umożliwienie prowadzenia działalności i generowania przychodów.',
  ],
  value: '390 033,00 PLN',
  funding: '285 390,00 PLN',
  tags: ['#KorzyściDlaCiebie', '#NextGenerationEU', '#FunduszeUE'],
}

// Podstrona „Dofinansowanie ze środków REACT-EU”
export const reactEu = {
  title: 'Dofinansowanie ze środków REACT-EU',
  intro:
    'redART EVENTS Rafał Wilczyński realizuje projekt pn. „Zwiększenie konkurencyjności firmy redART EVENTS Rafał Wilczyński, dotkniętej kryzysem wywołanym pandemią COVID-19”.',
  scopeLead: 'Zakres rzeczowy projektu obejmuje zakup:',
  scope: [
    'oświetlenia scenicznego wraz z wyposażeniem oraz',
    'wprowadzenia nowych technologii cyfrowych wykorzystujących medium Internetu do obsługi klienta i usprawniających organizację pracy Wnioskodawcy.',
  ],
  goal: 'Cel projektu: Celem głównym projektu jest zwiększeniu konkurencyjności firmy redART EVENTS Rafał Wilczyński – przedsiębiorstwa negatywnie dotkniętego skutkami epidemii COVID-19 poprzez działania inwestycyjne ukierunkowane na odbudowę pozycji rynkowej MŚP w gospodarce po pandemii COVID-19 i zwiększenie jego odporności gospodarczej na kryzys do 30.09.2023 r.',
  effects:
    'Zakup oświetlenia scenicznego w postaci ruchomych głowic LED wraz z wyposażeniem w postaci haków umożliwi firmie redART realizację większych zleceń, w ramach których konieczne jest zapewnienie większej liczby lamp z różnym zabarwieniem kolorystycznym. Dodatkowo pozwoli to firmie uniezależnić się od podwykonawców, a także świadczyć usługi w nowym zakresie jakim będzie oświetlenie architektoniczne.',
  beneficiary: 'redART EVENTS Rafał Wilczyński',
  value: '419 651,40 zł',
  funding: '290 003,00 zł',
}
