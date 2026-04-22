Lag BIP39-seed-fraser i nettleseren, kontroller importerte mnemonikker før du stoler på dem, og konverter mellom rå entropi og lommebokord uten å sende sensitivt materiale til en annen tjeneste. Dette verktøyet er nyttig når du trenger ett arbeidsområde for generering, checksum-validering og lavnivå-gjenoppretting.

## Generer med hensikt

Velg en støttet ordliste og et antall ord, og generer på nytt til du har seed-frasen du vil lagre. Den tilhørende entropien vises ved siden av frasen slik at du kan kontrollere den nøyaktige styrken og ta vare på begge representasjonene når du dokumenterer en gjenopprettingsflyt.

## Valider før import

Bruk valideringsmodus når noen gir deg en mnemonic-frase og du vil ha en rask kontroll av checksum og ordantall før du importerer den i en annen lommebok. Et gyldig resultat viser også den gjenopprettede entropien, noe som hjelper når du sammenligner to gjenopprettingskilder eller feilsøker avledningssteg.

## Konverter entropi med omtanke

Konverteringsmodus fungerer begge veier: fra rå entropi til ord og fra mnemonic-ord tilbake til entropi. Det gjør den praktisk for testdata, deterministiske lommebokdemoer og hendelsesgjennomganger der du må bekrefte at en frase fortsatt tilsvarer de forventede bytene under en bestemt BIP39-ordliste.
