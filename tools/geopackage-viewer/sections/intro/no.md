## Slik åpner du en GeoPackage-fil

Velg eller slipp en .gpkg-fil, og bruk **Lag eller tabell** til å bytte mellom elementene i filen. Velg **Prøv et eksempel** for å åpne en pakke med et punktlag og et polygonlag. GeoPackage-filen åpnes lokalt på enheten din. Det innebygde kartet fungerer uten nett når siden er lastet, og henter ingen kartfliser fra nettet.

## Utforsk vektorlag og egenskaper

Kartutsnittet tilpasses det valgte vektorlaget. Klikk på et punkt, en linje eller et polygon, eller velg et element fra listen **Objekter** for å se egenskapene. Når laget angir et koordinatreferansesystem som støttes, plasserer viseren objektene ved hjelp av WGS 84. Du kan også velge en tabell uten geometri og bla gjennom enkeltposter. Viseren forhåndsviser inntil 500 poster per lag for å holde kartet responsivt ved store filer.

## Hva inneholder en GeoPackage-fil?

GeoPackage er et OGC-format som lagrer geografiske data i én SQLite-fil. En pakke kan inneholde flere vektorlag, vanlige egenskapstabeller og tabeller med kartfliser. Oppføringer med kartfliser vises i laglisten. Velg et vektorlag for å se geometrier på kartet. Har du en Esri Shapefile med separate tilhørende filer, bruker du [Shapefile-viser](../shapefile-viewer/).
