# UUID v7 Generator

UUID v7 är ett modernt UUID-format som placerar en Unix-tidsstämpel i millisekunder först i identifieraren och fyller återstående bitar med slumpmässighet. Det gör värdena globalt unika i praktiken, samtidigt som de naturligt kan sorteras efter skapandetid.

## Vad det här verktyget gör

Den här generatorn skapar UUID v7-värden helt i din webbläsare. Du kan generera en enskild identifierare eller en omgång med upp till 100, och sedan kopiera listan eller ladda ner den som en textfil för startdata, databasposter, händelsefixturer eller testnyttolaster.

## När UUID v7 hjälper

UUID v7 är användbart när du vill ha opaka identifierare som ändå sorteras väl i databaser, loggar, köer och distribuerade händelseströmmar. Jämfört med slumpmässiga UUID v4-värden minskar UUID v7 indexomflyttning eftersom nyare poster tenderar att hamna nära slutet av ett sorterat nyckelutrymme.

## Anteckningar om sorterbarhet och säkerhet

Tidsstämpeldelen registrerar millisekunder, inte ett privat eller hemligt värde. Om en identifierare inte bör avslöja ungefärlig skapandetid, använd ett helt slumpmässigt format i stället. Inom en genererad omgång håller det här verktyget värden monotona för samma millisekund, samtidigt som UUID v7-versionens och variantens bitar bevaras.
