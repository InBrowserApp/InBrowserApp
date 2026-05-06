# Hva er AES-kryptering?

AES er en symmetrisk krypteringsalgoritme, som betyr at den samme hemmeligheten brukes til å kryptere og dekryptere dataene. Dette verktøyet kjører helt i nettleseren din og bruker Web Crypto API, slik at klartekst, passord og valgte filer ikke lastes opp.

Standardmodusen er AES-GCM fordi den krypterer og autentiserer resultatet. Autentisering er viktig: Hvis chifferteksten, saltet eller IV-en endres senere, skal dekryptering feile i stedet for å returnere endrede data. AES-CBC og AES-CTR er tilgjengelige for kompatibilitet, men de autentiserer ikke chiffertekst alene.

## Når du bør bruke dette verktøyet

Bruk det når du trenger å beskytte et notat, token, konfigurasjonsutdrag eller en liten fil før du lagrer eller deler det via en annen kanal. Resultatet er en JSON-konvolutt som inneholder modus, innstillinger for nøkkelavledning, salt, IV og chiffertekst, slik at disse parameterne holdes samlet for det tilsvarende dekrypteringstrinnet.

For passordbasert kryptering behandles passordet med PBKDF2 og et tilfeldig salt. Øk antall iterasjoner når du tåler tregere kryptering og dekryptering. For kryptering med rå nøkkel limer du inn en heksadesimal nøkkel med nøyaktig valgt lengde: 32 hex-tegn for 128-bit, 48 for 192-bit eller 64 for 256-bit.

## Praktiske merknader

Hold passordet eller den rå nøkkelen atskilt fra den krypterte JSON-en. Alle som har både JSON-en og nøkkelmaterialet, kan dekryptere dataene. Hvis du krypterer en fil, laster du ned JSON-resultatet og oppbevarer det opprinnelige filnavnet separat hvis den konteksten er viktig.

Ikke gjenbruk en manuell IV med samme nøkkel. Dette verktøyet genererer en ny IV og et nytt salt for hver kjøring, som er det tryggere standardvalget. Foretrekk AES-GCM med mindre et annet system spesifikt krever AES-CBC eller AES-CTR.
