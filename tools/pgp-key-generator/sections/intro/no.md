# PGP-nøkkelgenerator

Bruk dette verktøyet til å opprette et OpenPGP-nøkkelpar direkte i nettleseren din. Det lager en armert offentlig nøkkel, privat nøkkel, tilbakekallingssertifikat, nøkkel-ID og fingeravtrykk, slik at du kan sette opp kryptert e-post, filkryptering, utgivelsessignering eller arbeidsflyter for kontogjenoppretting uten å sende nøkkelmaterialet til en server.

## Når du bør bruke det

PGP-nøkler er nyttige når du trenger asymmetrisk kryptografi: andre bruker den offentlige nøkkelen din til å kryptere data til deg eller bekrefte signaturer, mens den private nøkkelen dekrypterer data og oppretter signaturer. En nettleserbasert generator er praktisk for korte oppsettøkter, demoer eller lokale arbeidsflyter der du vil ha resultatet umiddelbart.

## Slik genererer du et nøkkelpar

Skriv inn navn, e-postadresse eller begge deler, slik at nøkkelen får en gjenkjennelig bruker-ID. Legg til en valgfri kommentar hvis du vil skille mellom nøkler for arbeid, prosjekt eller utgivelsessignering. Velg ECC for moderne OpenPGP-programvare, eller RSA når du trenger kompatibilitet med eldre verktøy. En passfrase er valgfri, men anbefales sterkt for alle private nøkler du har tenkt å beholde.

## Nøkkeltyper og utløp

ECC bruker Curve25519 og er standardvalget fordi det er kompakt og raskt. RSA er tilgjengelig med 2048, 3072 og 4096 bit for kompatibilitet. Utløp angis i dager; bruk 0 bare for nøkler du aktivt administrerer og kan tilbakekalle. Kortere utløpsperioder reduserer langsiktig risiko og gjør det enklere å få gode vaner for nøkkelrotasjon.

## Sikker håndtering av private nøkler

Last ned den offentlige nøkkelen, den private nøkkelen og tilbakekallingssertifikatet som separate filer. Sikkerhetskopier den private nøkkelen i en kryptert passordbehandler eller sikker frakoblet lagring, og oppbevar tilbakekallingssertifikatet et annet sted, slik at du kan ta nøkkelen ut av bruk hvis den private nøkkelen mistes eller eksponeres. Før du publiserer en offentlig nøkkel, bør du sammenligne fingeravtrykket via en betrodd kanal.
