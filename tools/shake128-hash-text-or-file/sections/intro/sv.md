## Vad är SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) är en funktion med utökbar utdatalängd (XOF) i SHA-3-familjen. Till skillnad från hashfunktioner med fast längd kan den returnera valfritt antal utdata-bitar och ändå ge 128-bitars säkerhetsstyrka. Den är standardiserad av NIST i FIPS 202 och bygger på Keccak-svampkonstruktionen.

Den flexibiliteten är viktig när ett protokoll, filformat eller en intern checksumregel kräver en viss digestlängd. I det här verktyget kan du hasha vanlig text eller uppladdade filer och välja utdatalängd i bitar, så länge den är en multipel av 8.

Vanliga användningar är protokollhashning, nyckelhärledning, kryptografiska digester med variabel längd och arbetsflöden för dataintegritet där samma indata och samma utdatalängd alltid måste ge samma resultat.
