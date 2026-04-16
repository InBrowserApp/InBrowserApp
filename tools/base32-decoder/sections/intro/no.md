## Hva er Base32?

Base32 er nyttig når en tekstkanal eller en kanal uten skille mellom store og små bokstaver må frakte binærdata, som OTP-hemmeligheter, DNS-trygge token eller eksporterte konfigurasjonsverdier. Det er et kodingslag, ikke et sikkerhetslag.

## Når du bør bruke det

- Dekode Base32-hemmeligheter eller token tilbake til de opprinnelige bytene.
- Undersøke verdier som er kopiert fra TOTP-oppsett, integrasjonseksporter eller konfigurasjonsfiler.
- Kontrollere om innlimte Base32-data har gyldige tegn og korrekt padding før bruk.

## Ting å huske på

- Base32 øker datastørrelsen mer enn Base64.
- Det krypterer eller skjuler ikke den opprinnelige verdien.
- Noen systemer utelater `=`-padding, men ugyldige tegn gir fortsatt dekodingsfeil.
