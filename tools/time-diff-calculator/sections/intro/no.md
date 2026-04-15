## Hva dette verktøyet er for

Bruk denne kalkulatoren til å måle nøyaktig hvor mye tid som har gått
mellom to lokale dato- og klokkeslettverdier, selv når de tilhører ulike
IANA-tidssoner. Det er nyttig når du trenger et pålitelig svar uten å
regne om offseter manuelt eller gjette hvordan sommertid påvirker
sammenligningen.

## Vanlige brukstilfeller

- Sammenligne en starttid i én by med en sluttid i en annen by.
- Måle medgått tid mellom logger, hendelser, flyvninger eller
  støttevinduer som er registrert i ulike tidssoner.
- Sjekke om to tidsstempler krysser midnatt, en helg eller en overgang
  til sommertid.

## Slik fungerer kalkulatoren

- Skriv inn lokal start- og sluttdato med klokkeslett i formatet
  `YYYY-MM-DD HH:mm:ss.SSS`, og velg deretter tidssone for hver side.
- Verktøyet konverterer begge tidsstemplene til UTC internt, og viser
  deretter signert varighet, absolutt varighet, ISO 8601-varighet og
  totalverdier fra millisekunder til dager.
- Bruk `Now` for raskt å fylle inn gjeldende tid, eller `Swap` for å
  snu sammenligningen. Offseter kan endre seg rundt overganger til
  sommertid.
