## Eksporter ICS-kalenderhendelser til CSV

Velg **ICS til CSV**, åpne en iCalendar-fil eller lim inn innholdet, og velg **Konverter**. Regnearket får én rad per lagret hendelse med tittel, start, slutt, sted, beskrivelse og eventuell gjentakelsesregel. Last ned CSV-filen for å gå gjennom eller redigere hendelsene i Excel eller Google Regneark. Heldagshendelser bruker datoer uten klokkeslett, og sluttdatoen regnes ikke med. En hendelse som varer hele 12. mai, har for eksempel 13. mai som sluttdato.

## Lag en ICS-fil fra CSV-rader

Velg **CSV til ICS** og bruk **Prøv et eksempel** for å se kolonneoverskriftene. Ta med minst `Title` og `Start`. Bruk `2026-05-12` for en heldagshendelse, `2026-05-12T09:00:00` for lokal tid eller `2026-05-12T09:00:00Z` for UTC. Verktøyet kjenner også igjen Google Kalender-overskrifter som `Subject`, `Start Date`, `Start Time` og `All Day Event`. Last ned ICS-filen for å importere hendelsene til kalenderen.

## Ta vare på originalkalenderen som fullstendig sikkerhetskopi

CSV lagrer hendelsesopplysninger som rader. Gjentakende hendelser representeres med gjentakelsesregler. Datoer for enkelthendelsene blir ikke generert. Innebygde tidssonedefinisjoner beholdes. Vedlegg, påminnelser, deltakere, unntak fra gjentakelsesreglene og avlysningsstatus blir værende i den opprinnelige kalenderfilen. Konverteringen skjer i nettleseren.
