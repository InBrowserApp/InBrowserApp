## Hva er e-postvalidering?

E-postvalidering sjekker om en adresse følger vanlige syntaksregler for lokal del, `@`-tegn, domenemerker og toppnivådomene. Det er nyttig for skjematesting, opprydding i eksempeldata og for å fange åpenbare tastefeil før innsending.

### Hva denne validatoren sjekker

- Ett enkelt `@` som skiller lokal del og domene
- Lengdegrenser for hele adressen, lokal del og domene
- Tillatte tegn, punktplassering, bindestrekregler og TLD-struktur
- Et normalisert resultat der domenet gjøres smått for enklere sammenligning

### Eksempler

- Gyldig: `name@example.com`
- Gyldig: `first.last+news@example.co.uk`
- Ugyldig: `name..dots@example.com`
- Ugyldig: `user@-example.com`

Internasjonaliserte domener bør oppgis i Punycode-ASCII, for eksempel `user@xn--bcher-kva.example`.

### Hva dette verktøyet ikke sjekker

- Om postboksen faktisk finnes eller kan motta e-post
- DNS-, MX-, SMTP- eller engangsleverandørkontroller
- Om et nettsted vil godta adressen etter sine egne forretningsregler
