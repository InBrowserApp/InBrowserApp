## Översikt

JSON Diff Path jämför två JSON-dokument och omvandlar varje strukturell ändring till en läsbar sökvägspost med både JSONPath- och JSON Pointer-utdata.

## När det är lämpligt

Använd det när du behöver granska ändringar i API-payloads, inspektera konfigurationsmigreringar eller generera RFC 6902 JSON Patch-operationer för automatisering.

## Så fungerar det

Verktyget tolkar båda JSON-inmatningarna, beräknar ändringarna `add`, `remove` och `replace`, och låter dig sedan filtrera dessa operationer och växla mellan en sökvägslista och JSON Patch-utdata i samma resultatpanel.
