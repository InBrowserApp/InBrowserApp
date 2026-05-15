## Vad är ett SSH-nyckelpar?

Ett SSH-nyckelpar är en publik nyckel och en privat nyckel som används för att autentisera mot servrar, Git-värdar, driftsättningssystem och andra SSH-baserade tjänster. Den publika nyckeln kan delas. Den privata nyckeln måste hållas hemlig.

Den här generatorn skapar OpenSSH-formaterade Ed25519- eller RSA-nycklar helt i din webbläsare. Den visar också SHA-256-fingeravtrycket, vilket är det kompakta värde som OpenSSH ofta visar när du verifierar en nyckel.

## När du ska använda det här verktyget

- Skapa en utvecklingsnyckel för en testserver, Git-fjärrkälla, container eller tillfällig labbmiljö.
- Generera en Ed25519-nyckel när du behöver ett modernt, kompakt standardval för ny SSH-åtkomst.
- Generera en RSA-nyckel när en äldre tjänst inte stöder Ed25519.
- Kopiera en publik nyckel till `authorized_keys` medan du behåller den privata nyckeln på din enhet.

## Så väljer du en algoritm

Ed25519 är det bästa standardvalet för de flesta nya SSH-nycklar eftersom den är liten, snabb och stöds brett av aktuella OpenSSH-versioner. RSA är användbart för kompatibilitet med äldre enheter, äldre Git-servrar eller policykrav som fortfarande förväntar sig RSA-nycklar.

För RSA är 4096 bitar ett konservativt standardval. Mindre 2048-bitarsnycklar är snabbare och fortfarande vanliga, men många team föredrar nu 3072 eller 4096 bitar för nya långlivade nycklar.

## Att tänka på

- Den privata nyckel som skapas här är okrypterad. Lägg till en lösenfras med `ssh-keygen -p -f <key-file>` om du behöver en.
- Förvara den privata nyckeln med restriktiva behörigheter, till exempel `chmod 600 <key-file>`.
- Klistra inte in privata nycklar i ärenden, chattar, loggar eller okända webbsidor.
- Rotera nycklar när en laptop, CI-hemlighet eller säkerhetskopia som innehåller den privata nyckeln kan ha exponerats.
