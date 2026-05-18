Generera en sats med UUID v4-identifierare direkt i din webbläsare när du behöver slumpmässiga ID:n för databasrader, API-fixtures, objektnycklar, testpayloads, importmallar eller enstaka driftsarbete.

## What UUID v4 Provides

UUID v4 är en 128-bitars identifierare som främst bygger på kryptografiskt säkra slumpbytes. Versions- och variantbitarna är fastställda av RFC 4122-layouten, så en UUID v4 har den välbekanta formen `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` men har ändå ett mycket stort slumpmässigt utrymme.

## Pick A Practical Batch Size

Standardsatsen ger dig tillräckligt många ID:n för många fixture- och kalkylbladsflöden utan att göra sidan svår att överblicka. Öka antalet när du förbereder en större import, eller minska det när du bara behöver några få identifierare för ett exempelanrop eller en manuell databasändring.

## Copy Or Export

Granska den genererade listan och kopiera den sedan till din editor eller ladda ned en ren textfil. Varje värde genereras lokalt, och den aktuella satsen laddas aldrig upp av det här verktyget.

## Collision Guidance

Kollisionsrisken för UUID v4 är extremt låg för normala applikationsarbetslaster, men det ersätter inte en unikhetsbegränsning i databasen. Fortsätt att upprätthålla unikhet där ID:t blir en primärnyckel, publik token eller varaktig referens.
