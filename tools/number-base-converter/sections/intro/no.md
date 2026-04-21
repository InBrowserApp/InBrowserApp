Konverter hele tall direkte i nettleseren mellom binær, oktal, desimal, heksadesimal, Base32, Base36, Base62, Base64 og egendefinerte baser fra 2 til 64. Alle beregninger skjer lokalt med BigInt, så du kan kontrollere store verdier uten å sende dem til en server.

## Når det er nyttig

Dette verktøyet er nyttig når det samme heltallet vises i logger, protokoller, ID-er eller spesifikasjoner med ulike alfabeter. Når du endrer ett felt, beregnes de andre umiddelbart på nytt, noe som er nyttig for feilsøking, dokumentasjon og manuell kontroll.

## Forskjeller mellom baser

Opp til base 36 aksepteres bokstaver uten hensyn til store og små bokstaver. Høyere baser behandler store og små bokstaver som ulike sifre, og Base64-raden her bruker det numeriske alfabetet `A-Z a-z 0-9 + /`, ikke byteorientert Base64-tekstkoding.

## Ting å passe på

Bare ikke-negative heltall støttes. Ledende nuller regnes som formatering, så den konverterte utdataen normaliseres og kan miste utfyllingen du skrev inn.
