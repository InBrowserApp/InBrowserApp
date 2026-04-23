## Hva er et PRC Resident ID?

Det 18-tegns PRC Resident ID-nummeret inneholder adressekode, fødselsdato, sekvenskode og kontrollsiffer. Denne validatoren kontrollerer disse delene offline og hjelper deg med å forstå hvordan nummeret er bygget opp.

### Slik fungerer valideringen

- Fjerner mellomrom og bindestreker og normaliserer siste tegn til stor `X`
- Krever nøyaktig 18 tegn: 17 sifre og et siste siffer eller `X`
- Sammenligner de første 6 sifrene med datasettet for administrative inndelinger fra 2023 og tolker den 8-sifrede fødselsdatoen
- Beregner kontrollsifferet på nytt fra de første 17 sifrene og sammenligner det med siste tegn

### Hva resultatet viser

- Regionoppdeling: provins, by, distrikt/fylke og den rå regionskoden
- Fødselsdato, nåværende alder, sekvenskode og kjønnsverdien som utledes fra sekvenskoden
- Den normaliserte ID-en sammen med forventet og faktisk kontrollsiffer for feilsøking

### Eksempel

`110101199001010015` kan leses slik:

- `110101` -> Dongcheng-distriktet, Beijing
- `19900101` -> fødselsdato `1990-01-01`
- `001` -> sekvenskode
- `5` -> kontrollsiffer

### Viktig merknad

Dette verktøyet utfører bare strukturell og checksumbasert validering offline. Et nummer som består disse kontrollene, beviser ikke at det tilhører en virkelig eller fortsatt gyldig identitetshandling.

Regionsnavnene er basert på datasettet for administrative inndelinger fra 2023.
