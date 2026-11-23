Åpne et 7z-, RAR-, ZIP- eller TAR-arkiv for å bla gjennom mappene før du pakker ut noe. Velg en fil for å forhåndsvise den eller laste den ned enkeltvis.

## Når du bør bruke den

Bruk den når du mottar en komprimert pakke og vil ta en rask titt uten å pakke ut hele arkivet. Den er nyttig for å kontrollere utgivelsespakker, nedlastede maler, loggpakker, kildekodeøyeblikksbilder eller et enkeltfilvedlegg med `.gz`.

## Personvern og filhåndtering

Arkivinnholdet leses lokalt i nettleserøkten din. Filen lastes ikke opp til InBrowser.App. Store tekstoppføringer begrenses i forhåndsvisningen for å holde siden responsiv; last ned oppføringen når du må inspisere hele filen.

## Støttede arkivformater

Arkivviseren åpner ZIP, 7z, RAR4 og RAR5, TAR, CPIO, AR (inkludert `.deb`-pakker), CAB, ISO 9660 og LHA. Den åpner også enkeltfiler og TAR-arkiver komprimert med GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA eller UNIX compress (`.Z`). Åpne for eksempel en utgivelsespakke med endelsen `.tar.zst` for å bla gjennom mappene, eller en `.zst`-loggfil for å laste ned den utpakkede filen.

Bruk et arkivprogram på datamaskinen for krypterte filer, arkiver som er delt i flere deler, RAR4-arkiver med solid komprimering eller oppføringer over 512 MiB i de nye formatene. Store arkiver med solid komprimering kan ta lengre tid å åpne eller pakke ut fordi dekoderen kan måtte behandle tidligere oppføringer først.

## Forhåndsvisningsatferd

Tekstlignende filer som JSON, Markdown, logger, kildekode, CSV, XML, YAML og TOML kan forhåndsvises med syntaksutheving når et passende språk er tilgjengelig. Vanlige bildefiler kan forhåndsvises visuelt, og PDF-dokumenter åpnes i nettleserens innebygde PDF-viser når den er tilgjengelig. Andre binærfiler kan fortsatt lastes ned, men verktøyet prøver ikke å rendere dem.
