En arkivvisare låter dig granska en komprimerad fil innan du extraherar den. Det här verktyget öppnar ZIP, TAR, GZ, TGZ och TAR.GZ-filer direkt i webbläsaren så att du kan kontrollera vad som finns inuti, bläddra i mappar, förhandsgranska läsbara filer och ladda ner bara den post du behöver.

## När ska den användas

Använd den när du får ett komprimerat paket och vill ta en snabb titt utan att packa upp hela arkivet. Den är användbar för att kontrollera releasepaket, nedladdade mallar, loggpaket, källkodssnapshots eller en enskild `.gz`-bilaga.

## Integritet och filhantering

Arkivinnehåll läses lokalt i din webbläsarsession. Filen laddas inte upp till InBrowser.App. Stora textposter begränsas i förhandsvisningen för att hålla sidan responsiv; ladda ner posten när du behöver granska hela filen.

## Arkivformat som stöds

Visaren stöder standard ZIP-arkiv, okomprimerade TAR-filer, GZIP-komprimerade enskilda filer och TAR-arkiv inneslutna i GZIP (`.tgz` eller `.tar.gz`). Lösenordsskyddade eller krypterade arkiv stöds inte i denna första omskrivningsomgång.

## Förhandsvisningens beteende

Textliknande filer som JSON, Markdown, loggar, källkod, CSV, XML, YAML och TOML kan förhandsgranskas med syntaxmarkering när ett matchande språk är tillgängligt. Vanliga bildfiler kan förhandsgranskas visuellt, och PDF-dokument öppnas i webbläsarens inbyggda PDF-visare när den är tillgänglig. Andra binära filer går fortfarande att ladda ner, men verktyget försöker inte rendera dem.
