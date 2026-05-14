## Hva dette verktøyet gjør

Denne SVG-optimalisatoren komprimerer én lokal SVG-fil eller et innlimt
SVG-dokument i nettleseren din. Den bruker SVGO-oppryddingspasseringer til å
fjerne kommentarer, metadata, overflødige attributter, unødvendig presisjon og
annen kode som ikke endrer det synlige bildet.

## Hvorfor det hjelper

SVG-filer eksportert fra designverktøy inneholder ofte redigeringsmetadata,
omfattende stier, ubrukte ID-er og kommentarer. Optimalisering kan redusere
nedlastingsstørrelsen, forbedre sideinnlasting og gjøre inline SVG-kode enklere
å gjennomgå før den publiseres på et nettsted, i en app, i en e-post eller på
en dokumentasjonsside.

## Slik fungerer det

Last opp en `.svg`-fil eller lim inn SVG-kode, velg den trygge
forhåndsinnstillingen eller juster de individuelle SVGO-passeringene, og kjør
deretter optimalisering. Verktøyet viser opprinnelig og optimalisert
forhåndsvisning, sparte byte og den endelige koden, slik at du kan kopiere den
eller laste ned en `.optimized.svg`-fil. SVG-en trenger aldri å forlate enheten
din.

## Praktiske merknader

- Behold den trygge forhåndsinnstillingen når SVG-en avhenger av ekstern CSS,
  skriptede ID-er eller symbolreferanser du ikke enkelt kan kontrollere.
- Bruk den aggressive forhåndsinnstillingen for enkle eksporterte ikoner,
  logoer og illustrasjoner der det er akseptabelt å fjerne dimensjoner og legge
  stiler inline.
- Forhåndsvis det optimaliserte bildet før du erstatter kildegrafikk, spesielt
  når kilden bruker masker, gradienter, filtre eller lenkede ressurser.
