## Lag en 2FA-kode med en oppsettsnøkkel eller QR-kode

Åpne innstillingene for tofaktorautentisering på nettstedet du vil beskytte, og velg alternativet for autentiseringsapp. Last opp eller skann QR-koden. Du kan også lime inn oppsettsnøkkelen eller en `otpauth://`-lenke og velge **Legg til konto**. Kopier koden som vises, til bekreftelsesfeltet på nettstedet for å fullføre oppsettet.

## Flytt kontoer fra en annen autentiseringsapp

Velg **Overfør kontoer** i Google Authenticator, og eksporter kontoene du vil flytte. Skann de eksporterte QR-kodene her med **Bruk kamera**, eller last opp de lagrede QR-bildene samlet. Åpne **Export** i den [opprinnelige autentiseringsappen fra InBrowser.App](https://authenticator.inbrowser.app/), velg **Google Authenticator**, last ned QR-bildet og last det opp her.

QR-koder for overføring fra Google importeres med et intervall på 30 sekunder. Overfør kontoene enkeltvis for å beholde egendefinerte intervaller fra den opprinnelige appen. Klikk på tannhjulet ved hver konto, åpne **Key URI** i **Config** og lim inn lenken her.

Kontoene dine lagres i denne nettleseren. Last ned en sikkerhetskopi via **Eksporter kontoer** før du sletter nettstedsdata eller bytter nettleser. Oppbevar sikkerhetskopien på et trygt sted, fordi den inneholder oppsettsnøklene dine.

## Hvorfor blir bekreftelseskoden min avvist?

De fleste nettsteder bruker tidsbaserte koder (TOTP). Sjekk at enheten stiller klokken automatisk. Vent på neste kode hvis den gjeldende snart utløper. Tellerbaserte koder (HOTP) endres først når du velger **Neste kode**. Bruk koden til riktig konto og følg eventuelle egne innstillinger fra nettstedet, uansett kodetype.
