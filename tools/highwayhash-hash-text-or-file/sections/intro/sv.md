## Vad är HighwayHash?

HighwayHash är en snabb nycklad hashfunktion som Google har utformat för fingeravtryck och integritetskontroller med hög genomströmning. Den använder en 256-bitarsnyckel och kan skapa 64-bitars-, 128-bitars- eller 256-bitarsutdata från samma text- eller filindata.

## När du bör använda den

- Bygg deterministiska nycklade kontrollsummor för cachenycklar, objekt-ID:n, shardning eller interna uppslagstabeller.
- Jämför filer eller textnyttolaster med samma nyckel när hastighet är viktigare än bred kryptografisk kompatibilitet.
- Generera 128-bitars- eller 256-bitarsfingeravtryck när en större icke-lösenordshash är användbar för integritetsarbetsflöden.

## Nyckel- och utdataalternativ

Ange nyckeln som exakt 32 byte hexadecimala data, till exempel `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Prefixet `0x` är valfritt, och verktyget accepterar mellanslag, kolon, bindestreck och understreck för att göra långa nycklar lättare att läsa. Om nyckeln lämnas tom används bibliotekets standardnyckel, vilket är praktiskt för snabba kontroller men inte bör behandlas som hemligt.

## Säkerhetsnoteringar

HighwayHash ersätter inte HMAC, digitala signaturer eller lösenordshashning. Använd den för snabba nycklade fingeravtryck och kontrollsummeflöden, inte för att bevisa äkthet mellan system som behöver standardiserad kryptografisk verifiering.
