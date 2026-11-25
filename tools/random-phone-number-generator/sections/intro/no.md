## Lag en liste med telefonnumre til testing

Velg land eller region og nummerformat, angi antall og velg **Generer**. Kopier resultatene til et skjema eller last ned en `UTF-8`-kodet tekstfil med ett nummer per linje. Bruk numrene til å teste inntastingsmasker i skjemaer, fylle en kontaktliste med eksempeldata eller sjekke hvordan appen din lagrer og viser telefonnumre.

## Velg nasjonalt eller internasjonalt format

Med **Nasjonalt** får du et av nummerformatene Faker.js har for landet du valgte. Et amerikansk nummer kan for eksempel vises som `(202) 555-0100`, og et britisk nummer som `07700 900123`. **Internasjonalt (E.164)** viser et plusstegn, landskoden og resten av sifrene uten mellomrom, som i `+12025550100` eller `+447700900123`.

## Behold plusstegnet og innledende nuller

Lagre telefonnumre som tekst i regneark og databaser. Et regneark som importerer `07700 900123` eller `+447700900123` som tall, kan fjerne den innledende nullen eller plusstegnet. Tallene er eksempler for testing av nummerformat. Bruk et testnummer du kontrollerer for å prøve anrop eller SMS.
