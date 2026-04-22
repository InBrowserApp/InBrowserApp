# Lag kalenderfiler uten å forlate nettleseren

Dette verktøyet genererer standard `.ics`-hendelsesfiler direkte i nettleseren. Du kan definere tidsbestemte eller heldagsarrangementer, velge strategi for tidssoner, legge til påminnelser og eksportere den ferdige kalenderoppføringen uten å synkronisere data til en server.

## Hvorfor bruke det

- Det passer når du bare trenger en kalenderfil og ikke en full arbeidsflyt med kalenderkonto.
- Det holder følsomme planer lokalt, samtidig som det fortsatt lager et standardbasert hendelsesvedlegg.
- Du kan justere gjentakelsesregler og påminnelser før du laster ned den endelige `.ics`-filen.

## Anbefalt flyt

1. Fyll inn hendelsessammendrag, sted, notater og en valgfri referanse-URL.
2. Velg hendelsesperioden, og avgjør deretter om du vil eksportere `UTC`-tidsstempler eller bevare den opprinnelige tidssonen med `TZID`.
3. Legg bare til gjentakelser og påminnelser når det trengs, last deretter ned filen og legg den ved der du deler hendelsen.

## Merknader

- `UTC`-utdata er som regel det tryggeste valget hvis du vil ha bred kalenderkompatibilitet.
- `TZID`-utdata bevarer den opprinnelige planleggingskonteksten for klienter som forstår navngitte tidssoner.
- For heldagshendelser beholder skjemaet sluttdatoen som inkluderende, selv om ICS-filen lagrer den som en eksklusiv sluttdato.
