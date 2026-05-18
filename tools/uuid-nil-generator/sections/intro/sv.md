## Vad är en nil UUID?

En nil-UUID är den standardiserade UUID vars 128 bitar alla är noll. Dess kanoniska textform är `00000000-0000-0000-0000-000000000000`, och den används ofta för att betyda att "ingen UUID har tilldelats ännu".

## När ska den användas?

Använd en nil-UUID när ett API, en databaskolumn, en fixture eller en konfigurationsfil kräver ett UUID-format värde men den verkliga identifieraren avsiktligt saknas. Den är användbar som platshållare i tester, importmallar, migreringsskript och protokoll som definierar ett uttryckligt tomt UUID-värde.

## Vad ska du se upp med?

Behandla inte nil-UUID:n som en genererad unik identifierare. Det är samma värde varje gång, så om den lagras där ett verkligt objekt-ID förväntas kan det dölja saknade data, bryta antaganden om unikhet eller få poster att se kopplade ut när de inte är det.
