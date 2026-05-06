## Vad är ett fingeravtryck för en publik SSH-nyckel?

Ett fingeravtryck för en publik SSH-nyckel är ett kort sammandrag av den publika nyckelblobben. Det ger dig ett kompakt värde att jämföra innan du litar på en nyckel i `authorized_keys`, en serverinventering eller ett driftsättningsflöde.

OpenSSH visar ofta SHA-256-fingeravtryck som `SHA256:...`. Äldre dokumentation och vissa granskningar använder fortfarande kolonseparerade MD5-fingeravtryck. Det här verktyget visar båda så att du kan matcha modern SSH-utdata och äldre poster utan att skicka nyckeln någonstans.

Klistra in en enskild publik nyckel, flera `authorized_keys`-rader eller ett SSH2-block med en publik nyckel. Tolken hoppar över kommentarer och authorized_keys-alternativ, läser den faktiska SSH-nyckelblobben och beräknar fingeravtrycken lokalt i webbläsaren.

- Verifiera att en kopierad publik nyckel matchar fingeravtrycket som en lagkamrat har delat.
- Jämför `authorized_keys`-poster mot en åtkomstlista för servrar.
- Granska nyckeltyp, nyckelstorlek, kurva och kommentar innan du kopierar ett fingeravtryck.
