## Öppna en IPFS- eller Filecoin-CAR-fil online

Välj en `.car`-fil från din enhet. Verktyget läser arkivet lokalt och visar dess rot-CID. Om arkivet innehåller flera rötter väljer du den du vill använda. Arkiven är Content Addressable aRchives som används av IPFS och Filecoin. Apples resurskataloger använder ett annat format med samma filändelse.

## Extrahera filer eller konvertera en CAR-mapp till ZIP

Öppna en mapp för att se innehållet. Välj en fil och välj sedan **Ladda ner fil** för att spara originalets byte. Välj **Ladda ner ZIP** för att exportera en mapp tillsammans med dess undermappar. ZIP-filen bevarar UnixFS-mappstrukturen.

## Vad betyder ett saknat block?

En CAR lagrar innehåll som block identifierade med CID:er. En rot kan länka till block som finns utanför ett ofullständigt arkiv. Om en post behöver ett block som saknas kan du hämta en fullständig export från källan eller ladda ner en post vars block är tillgängliga. CAR-filer kan även innehålla data i andra IPLD-format. Extrahering av filer och mappar använder här UnixFS. [IPLD:s CAR-format](https://ipld.io/specs/transport/car/)
