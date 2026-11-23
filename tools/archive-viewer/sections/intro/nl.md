Open een 7z-, RAR-, ZIP- of TAR-archief om door de mappen te bladeren voordat je het uitpakt. Selecteer een bestand om het vooraf te bekijken of afzonderlijk te downloaden.

## Wanneer gebruik je het

Gebruik het wanneer je een gecomprimeerd pakket ontvangt en snel wilt kijken zonder het hele archief uit te pakken. Het is handig voor het controleren van releasebundels, gedownloade sjablonen, logpakketten, broncode-snapshots of een losse `.gz`-bijlage.

## Privacy en bestandsverwerking

De inhoud van het archief wordt lokaal gelezen in je browsersessie. Het bestand wordt niet geüpload naar InBrowser.App. Grote tekstitems worden in het voorbeeld begrensd om de pagina responsief te houden; download het item wanneer je het volledige bestand wilt inspecteren.

## Ondersteunde archiefformaten

De archiefviewer opent ZIP, 7z, RAR4 en RAR5, TAR, CPIO, AR (inclusief `.deb`-pakketten), CAB, ISO 9660 en LHA. Je kunt ook losse bestanden en TAR-archieven openen die zijn gecomprimeerd met GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA of UNIX compress (`.Z`). Open bijvoorbeeld een releasebundel in `.tar.zst` om door de mappen te bladeren, of een logbestand in `.zst` om de uitgepakte versie te downloaden.

Gebruik een archiefprogramma op je computer voor versleutelde bestanden, meerdelige archieven, solid-archieven in RAR4-formaat of bestanden groter dan 512 MiB in de nieuw ondersteunde formaten. Het openen of uitpakken van grote solid-archieven kan langer duren, omdat de decoder mogelijk eerst eerdere bestanden moet verwerken.

## Voorbeeldgedrag

Tekstachtige bestanden zoals JSON, Markdown, logs, broncode, CSV, XML, YAML en TOML kunnen worden bekeken met syntaxmarkering wanneer een passende taal beschikbaar is. Veelgebruikte afbeeldingsbestanden kunnen visueel worden bekeken, en PDF-documenten worden geopend in de ingebouwde PDF-viewer van de browser wanneer die beschikbaar is. Andere binaire bestanden blijven downloadbaar, maar de tool probeert ze niet weer te geven.
