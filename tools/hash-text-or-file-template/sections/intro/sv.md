## Vad är en text- eller filhash?

En hashfunktion omvandlar text eller filers byte till ett hashvärde med fast längd. Samma indata och algoritm ger alltid samma hashvärde, så hashar är användbara när du behöver ett upprepbart fingeravtryck utan att ladda upp privata data.

## När ska du använda det här verktyget?

Använd det här verktyget för att verifiera kontrollsummor för nedladdningar, jämföra om två filer är identiska, spara ett snabbt fingeravtryck för ett textutdrag eller felsöka system som publicerar SHA-hashar. När du importerar en fil hashas filens byte direkt, medan textläget hashar UTF-8-texten som visas i redigeraren.

## Välja algoritm

SHA-256 är ett stabilt standardval för nya integritetskontroller. SHA-384 och SHA-512 ger längre SHA-2-hashvärden när ett annat system förväntar sig de formaten. SHA-1 finns med för jämförelser med äldre system, men bör inte användas i nya säkerhetskänsliga konstruktioner.

## Integritet och begränsningar

Hashningen körs lokalt i din webbläsare via Web Crypto, och filer laddas inte upp. En hash är inte kryptering: den kan inte skydda en hemlighet på egen hand, och lösenordslagring kräver en särskild lösenordshashfunktion med salt och arbetsfaktor.
