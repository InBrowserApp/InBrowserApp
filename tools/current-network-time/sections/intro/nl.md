## Waar deze tool voor bedoeld is

Gebruik deze tool om de klok van je apparaat te vergelijken met een tijdmeting
uit het netwerk. De tool haalt een tijdstempel op via het trace-endpoint van
Cloudflare, schat het midden van de netwerklatentie en toont daarna de
netwerkklok in je browser.

## Waar het helpt

- Controleren of je lokale systeemklok voor- of achterloopt.
- Tijdsdrift bevestigen voordat je TLS, tokens, planners of logs onderzoekt.
- Snel een netwerkgebaseerde referentietijd krijgen zonder NTP-tools te
  installeren.

## Waar je op moet letten

- De getoonde offset is een schatting en hangt af van netwerklatentie.
- Als het trace-verzoek mislukt, valt de tool terug op je lokale klok tot de
  volgende geslaagde synchronisatie.
- Voor een nauwkeurige systeemcorrectie moet je de tijdsynchronisatie van je
  apparaat of de NTP-configuratie aanpassen.
