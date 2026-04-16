## Hva er Base32?

Base32 er nyttig når en tekstkanal eller en kanal uten skille mellom store og små bokstaver må frakte binærdata, som OTP-hemmeligheter, DNS-trygge token eller eksporterte konfigurasjonsverdier. Det er et kodingslag, ikke et sikkerhetslag.

## Når du bør bruke det

- Kode bytes, tekst eller filer til Base32 før de sendes gjennom tekstbaserte kanaler.
- Klargjøre OTP-hemmeligheter, eksporterte innstillinger eller binære blobber for systemer som forventer Base32-inndata.
- Gjøre rå filbytes om til en kopierbar streng for overføring, logging eller manuell inntasting.

## Ting å huske på

- Base32 øker datastørrelsen mer enn Base64.
- Det krypterer eller skjuler ikke den opprinnelige verdien.
- Noen systemer krever `=`-padding, mens andre godtar utdata uten padding, så det er best å tilpasse seg mottakeren.
