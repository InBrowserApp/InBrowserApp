## Hva er et SSH-nøkkelpar?

Et SSH-nøkkelpar er en offentlig nøkkel og en privat nøkkel som brukes til å autentisere mot servere, Git-tjenester, distribusjonssystemer og andre SSH-baserte tjenester. Den offentlige nøkkelen kan deles. Den private nøkkelen må holdes hemmelig.

Denne generatoren oppretter OpenSSH-formaterte Ed25519- eller RSA-nøkler helt i nettleseren din. Den viser også SHA-256-fingeravtrykket, som er den kompakte verdien OpenSSH vanligvis viser når du verifiserer en nøkkel.

## Når du bør bruke dette verktøyet

- Opprett en utviklingsnøkkel for en testserver, en Git-remote, en container eller et midlertidig labmiljø.
- Generer en Ed25519-nøkkel når du trenger et moderne, kompakt standardvalg for ny SSH-tilgang.
- Generer en RSA-nøkkel når en eldre tjeneste ikke støtter Ed25519.
- Kopier en offentlig nøkkel til `authorized_keys` samtidig som du beholder den private nøkkelen på enheten din.

## Slik velger du algoritme

Ed25519 er det beste standardvalget for de fleste nye SSH-nøkler fordi den er liten, rask og bredt støttet av gjeldende OpenSSH-versjoner. RSA er nyttig for kompatibilitet med eldre enheter, eldre Git-servere eller policykrav som fortsatt forventer RSA-nøkler.

For RSA er 4096 bit et konservativt standardvalg. Mindre 2048-biters nøkler er raskere og fortsatt vanlige, men mange team foretrekker nå 3072 eller 4096 bit for nye nøkler som skal vare lenge.

## Hva du bør huske på

- Den private nøkkelen som produseres her, er ukryptert. Legg til en passfrase med `ssh-keygen -p -f <key-file>` hvis du trenger en.
- Lagre den private nøkkelen med begrensede rettigheter, for eksempel `chmod 600 <key-file>`.
- Ikke lim inn private nøkler i saker, chat, logger eller ukjente nettsider.
- Roter nøkler når en bærbar datamaskin, en CI-hemmelighet eller en sikkerhetskopi som inneholder den private nøkkelen, kan ha blitt eksponert.
