## Förhandsvisa en Graphviz DOT-graf online

Klistra in DOT-kod från en fil, ett skript eller dokumentation i **DOT-källkod**. Grafen uppdateras medan du skriver. Använd `digraph` och `->` för riktade kanter eller `graph` och `--` för oriktade kanter. I de inbyggda exemplen kan du se hur beroenden, nätverk och kluster beskrivs i DOT.

## Välj en layoutmotor för Graphviz

Börja med `dot` för grafer i lager, till exempel byggberoenden. Prova `neato` eller `fdp` för att sprida ut noderna i ett oriktat nätverk, eller `sfdp` för ett större nätverk. Välj `circo` för en cirkulär layout, `twopi` för ett radiellt träd, `osage` för grafer med kluster eller `patchwork` för trädkartor. DOT-koden ligger kvar när du byter layoutmotor.

## Tolka meddelanden om layout och syntax

Graphviz kan rapportera fel om kantoperatorn inte stämmer med graftypen eller om en klammerparentes eller ett citattecken saknas. Kontrollera raden som anges i felmeddelandet och raden ovanför. Graphviz kan också visa grafen tillsammans med information om attribut som inte kunde användas. Om grafen har ett eget `layout`-attribut använder Graphviz den motor som anges där. Läs [referensen för DOT-språket](https://graphviz.org/doc/info/lang.html) och [Graphviz layoutguide](https://graphviz.org/docs/layouts/) för mer information.
