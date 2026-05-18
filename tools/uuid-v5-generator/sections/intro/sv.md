Generera UUID v5-identifierare från ett namnrymds-UUID och ett namn utan att skicka något av värdena till en server. UUID v5 är användbart när du behöver en stabil identifierare som kan återskapas senare från samma indata, till exempel ett ID för ett domännamn, en URL, objektsökväg, kontohandtag eller fixturpost.

## Så fungerar UUID v5

UUID v5 kombinerar ett namnrymds-UUID med en namnsträng, hashar dessa byte med SHA-1 och tillämpar sedan versions- och variantbitarna från RFC 4122. Eftersom indatan är deterministisk producerar `example.com` i DNS-namnrymden alltid samma UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Välja en namnrymd

Använd `ns:DNS` för domännamn, `ns:URL` för URL:er, `ns:OID` för objektidentifierare och `ns:X.500 DN` för X.500-distinguished names. Du kan också klistra in din egen UUID-namnrymd när din applikation behöver identifierare som är avgränsade till en produkt, kund, datauppsättning eller migrering.

## När du bör använda det

Välj UUID v5 när reproducerbarhet är viktigare än slumpmässighet. Det passar bra för deterministiska importer, testfixturer, poster med namnrymd och system som behöver ge samma logiska objekt samma ID mellan körningar. För hemliga token eller oförutsägbara publika ID:n bör du använda en slumpgenerator i stället.
