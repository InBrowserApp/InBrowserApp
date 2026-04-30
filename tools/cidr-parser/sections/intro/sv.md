CIDR Parser omvandlar ett block som `10.24.8.19/21` eller `2001:db8:abcd::123/64` till nätverket du faktiskt menar. Den normaliserar hostadressinmatning, visar det kanoniska subnätet och lyfter fram gränserna du oftast behöver när du skriver brandväggsregler, dokumenterar intervall eller kontrollerar om en allokering är större än tänkt.

## Vad den visar

Resultatet börjar med en snabb översikt och bryter sedan ned blocket i praktiska detaljer: kanonisk CIDR, totalt och användbart antal adresser, intervallstart och -slut samt heltalsvärdena bakom blocket. För IPv4 får du även nätmask, wildcard-mask och broadcast-adress. För IPv6 behåller parsern samma arbetsflöde men döljer fält som inte gäller.

## Varför kanonisering spelar roll

Många inklistrade CIDR-värden innehåller hostbitar. Det fungerar för människor, men routrar, ACLs och dokumentation behöver vanligtvis den kanoniska nätverksadressen. Genom att skriva om blocket innan du kopierar något hjälper verktyget dig att upptäcka off-by-one-antaganden innan de hamnar i konfiguration.

## Praktiska anteckningar

- IPv4-blocken `/31` och `/32` behandlas som helt användbara, vilket matchar modern point-to-point- och host-route-användning.
- IPv6-block rapporterar hela adressrymden och användbart intervall utan att hitta på ett broadcast-koncept.
- Allt körs lokalt i webbläsaren, så interna subnät lämnar inte sidan medan du inspekterar dem.
