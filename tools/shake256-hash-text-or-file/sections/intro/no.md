## Hva er SHAKE256 (FIPS 202)?

SHAKE256 (FIPS 202) er en funksjon med utvidbar utdata (XOF) i SHA-3-familien. I motsetning til hashfunksjoner med fast lengde kan den returnere et vilkårlig antall utdata-biter samtidig som den gir 256-bits sikkerhetsstyrke. Den er standardisert av NIST i FIPS 202 og bygger på Keccak-svampkonstruksjonen.

Denne fleksibiliteten er viktig når en protokoll, et filformat eller en intern kontrollsummeregel krever en bestemt digestlengde. I dette verktøyet kan du hashe ren tekst eller opplastede filer og velge utdatalengde i biter, så lenge den er et multiplum av 8.

Vanlige bruksområder er protokoll-hashing, nøkkelavledning, kryptografiske digester med variabel lengde og arbeidsflyter for dataintegritet der samme input og samme utdatalengde alltid må gi samme resultat.
