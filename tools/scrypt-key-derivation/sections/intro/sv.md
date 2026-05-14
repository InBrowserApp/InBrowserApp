## Vad är scrypt?

scrypt är en minneshård lösenordsbaserad nyckelhärledningsfunktion (KDF). Den omvandlar ett lösenord och salt till deterministiska nyckelbyte medan den avsiktligt använder CPU-tid och minne, vilket gör storskalig lösenordsgissning dyrare än enkel hashning.

**Nyckelpunkter:**

- Använder `N` (kostnadsfaktor), `r` (blockstorlek) och `p` (parallellism)
- Högre inställningar för `N` och `r` ökar minnes- och beräkningskostnaden
- Producerar samma härledda nyckel endast när lösenord, salt, parametrar och utmatningslängd matchar

**Bästa praxis:**

- Använd ett unikt slumpmässigt salt för varje lösenord eller hemlighet
- Lagra `N`, `r`, `p`, saltformat och utmatningslängd bredvid den härledda nyckeln
- Finjustera parametrarna på den långsammaste enheten du behöver stödja innan du använder dem i produktion
