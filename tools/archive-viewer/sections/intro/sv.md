Öppna ett arkiv i 7z-, RAR-, ZIP- eller TAR-format och bläddra bland mapparna innan du packar upp något. Välj en fil för att förhandsgranska den eller ladda ner den separat.

## När ska den användas

Använd den när du får ett komprimerat paket och vill ta en snabb titt utan att packa upp hela arkivet. Den är användbar för att kontrollera releasepaket, nedladdade mallar, loggpaket, källkodssnapshots eller en enskild `.gz`-bilaga.

## Integritet och filhantering

Arkivinnehåll läses lokalt i din webbläsarsession. Filen laddas inte upp till InBrowser.App. Stora textposter begränsas i förhandsvisningen för att hålla sidan responsiv; ladda ner posten när du behöver granska hela filen.

## Arkivformat som stöds

Arkivvisaren öppnar ZIP, 7z, RAR4, RAR5, TAR, CPIO, AR (inklusive `.deb`-paket), CAB, ISO 9660 och LHA. Den öppnar också enskilda filer och TAR-arkiv som komprimerats med GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA eller UNIX compress (`.Z`). Du kan till exempel öppna ett releasepaket i `.tar.zst`-format för att bläddra bland mapparna eller en logg i `.zst`-format för att ladda ner den uppackade filen.

Använd ett arkivprogram på datorn för krypterade filer, delade arkiv, solida RAR4-arkiv eller poster som är större än 512 MiB i de nytillkomna formaten. Stora solida arkiv kan ta längre tid att öppna eller packa upp, eftersom tidigare poster kan behöva bearbetas först.

## Förhandsvisningens beteende

Textliknande filer som JSON, Markdown, loggar, källkod, CSV, XML, YAML och TOML kan förhandsgranskas med syntaxmarkering när ett matchande språk är tillgängligt. Vanliga bildfiler kan förhandsgranskas visuellt, och PDF-dokument öppnas i webbläsarens inbyggda PDF-visare när den är tillgänglig. Andra binära filer går fortfarande att ladda ner, men verktyget försöker inte rendera dem.
