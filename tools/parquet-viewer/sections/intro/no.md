## Undersøk Parquet-filer i nettleseren

Åpne eller slipp en `.parquet`-fil for å bla gjennom dataene og undersøke fysisk type, logisk annotasjon og gjentakelse for hvert felt. Nestede grupper forblir synlige i skjemaet. Sammendraget viser antall rader, kolonner, radgrupper, komprimering og programmet som opprettet filen, når dette er tilgjengelig. Du kan prøve det inkluderte eksemplet uten å velge en fil.

## Bla gjennom data og eksporter CSV eller JSON

Data lastes inn én side om gangen. Bruk sidekontrollene for å navigere i filen, og velg en celle for å lese hele verdien. Bytt til **Skjema** for å undersøke feltene. Bruk **Eksporter data** for å laste ned gjeldende side eller alle rader som UTF-8-CSV eller en JSON-matrise. Eksport av hele filen forberedes i bolker og kan avbrytes.

CSV inneholder kolonnenavn og setter verdier med kommaer, anførselstegn og linjeskift i anførselstegn. null-verdier blir tomme CSV-felt og forblir `null` i JSON. Nestede verdier bruker JSON; binærverdier bruker heksadesimal tekst. For å bevare 64-biters heltall skriver JSON dem som strenger. Datoer og tidsstempler bruker ISO-tekst med millisekundpresisjon. Desimaltall følger leserens numeriske presisjon, så denne viseren er ikke et tapsfritt konverteringsverktøy for desimaltall eller tidsstempler med høy presisjon.

## Lokal behandling

Filen din leses lokalt i en bakgrunnsarbeider og lastes aldri opp. Viseren leser først bunnteksten og deretter bare radområdene som trengs for visningen. Dekoding av Parquet-radgrupper kan likevel kreve mye minne; eksportstørrelsen begrenses av nettleserens tilgjengelige minne. Ukomprimerte data og kodekene Snappy, Gzip, Brotli, Zstandard og LZ4 støttes av hyparquet og komprimeringspakken til biblioteket. Krypterte Parquet-filer støttes ikke.
