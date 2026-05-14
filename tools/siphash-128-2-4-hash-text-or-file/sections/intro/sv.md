## Vad är SipHash-128-2-4?

SipHash-128-2-4 är en snabb nycklad hashfunktion utformad för korta meddelanden och skydd av hashtabeller. Den använder en hemlig 128-bitars nyckel och ger ett 128-bitars resultat, vanligtvis visat som ett hexadecimalt värde med 32 tecken.

## När du bör använda den

- Skydda hashtabeller på serversidan mot hash-flooding-attacker när nyckeln hålls privat.
- Skapa deterministiska nycklade kontrollsummor för cachenycklar, shardning eller interna uppslagstabeller.
- Jämför textutdrag eller filer med samma nyckel när kryptografisk autentisering inte krävs.

## Nyckelformat

Ange nyckeln som exakt 16 byte hexadecimala data, till exempel `0x000102030405060708090a0b0c0d0e0f`. Prefixet `0x` är valfritt, och verktyget accepterar mellanslag, kolon, bindestreck och understreck för att göra långa nycklar lättare att läsa.

## Säkerhetsnoteringar

SipHash-128-2-4 ersätter inte HMAC, digitala signaturer eller lösenordshashning. Använd den för arbetsflöden med nycklade hashtabeller och kontrollsummor, inte för att bevisa äkthet mellan system som behöver kryptografiska säkerhetsgarantier.
