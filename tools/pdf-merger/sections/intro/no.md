# Slå sammen PDF-filer i nettleseren

Bruk denne PDF-sammenslåingen når du trenger ett dokument fra flere kilde-PDF-er, for eksempel ved å kombinere skannede sider, sette sammen signerte skjemaer eller pakke rapporter for deling. Legg til to eller flere filer, se gjennom sidetallene, og ordne deretter køen før du lager den endelige PDF-en.

## Slik fungerer sammenslåingsrekkefølgen

Verktøyet legger til hver side fra den første PDF-en, deretter hver side fra den neste PDF-en, og fortsetter nedover køen. Du kan endre rekkefølgen med pilkontrollene, dra rader på skrivebord, fjerne feil og forhåndsvise hver kildefil før sammenslåing.

## Personvern og filhåndtering

All tolking og sammenslåing skjer lokalt i nettleseren din med `pdf-lib` og en bakgrunnsarbeider. Filene dine lastes ikke opp til InBrowser.App, og den genererte nedlastingslenken finnes bare i den gjeldende nettleserøkten.

## Begrensninger å kjenne til

Krypterte eller skadede PDF-er kan ikke slås sammen pålitelig. Hvis en fil er beskyttet med et eierpassord, må du fjerne den begrensningen først og legge til den opplåste PDF-en på nytt. Svært store filer kan ta lengre tid fordi nettleseren må kopiere hver side inn i et nytt dokument.
