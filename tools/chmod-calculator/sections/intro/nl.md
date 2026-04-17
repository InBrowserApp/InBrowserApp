## Wat is chmod?

`chmod` ("change mode") is een Unix/Linux-commando om bestands- en maprechten te wijzigen. Met deze calculator kun je schakelen tussen numerieke rechten zoals `755`, symbolische rechten zoals `rwxr-xr-x` en de selectiematrix, zonder alles zelf uit te rekenen.

## Hoe numerieke rechten werken

Elk cijfer staat voor één rol: eigenaar, groep en anderen. Binnen elk cijfer betekent `4` lezen, `2` schrijven en `1` uitvoeren. Tel de waarden bij elkaar op om het gewenste recht te krijgen: `7 = rwx`, `6 = rw-`, `5 = r-x` en `4 = r--`. Bij mappen betekent de uitvoerbit ook dat je de map kunt betreden.

## Veelvoorkomende chmod-voorbeelden

- `chmod 755 script.sh` geeft de eigenaar volledige toegang en laat anderen lezen en uitvoeren.
- `chmod 644 notes.txt` houdt een bestand schrijfbaar voor de eigenaar terwijl anderen het alleen kunnen lezen.
- `chmod 600 .env` is een gebruikelijke keuze voor privégeheimen omdat alleen de eigenaar mag lezen of schrijven.
- `chmod 775 shared-folder` is handig voor teammappen wanneer de groep ook bestanden moet kunnen maken en wijzigen.
