# Wat is een UUID-decoder?

Een UUID-decoder legt de structuur binnen een Universally Unique Identifier uit. Hij normaliseert veelvoorkomende geplakte formaten, controleert of de waarde een 128-bit UUID is en toont de versie, variant, ruwe hexadecimale bytes en kopieerklare numerieke representaties.

UUID's worden vaak behandeld als ondoorzichtige tekenreeksen, maar de versienibble vertelt hoe de identifier is gemaakt. UUID's van versie 4 zijn willekeurig, versies 3 en 5 zijn naamgebaseerde hashes, en tijdgeordende versies zoals 1, 6 en 7 kunnen tijdstempelinformatie bevatten.

## Wanneer gebruik je dit

Gebruik deze tool wanneer je een identifier uit logs, databases, API's, traces of testfixtures moet inspecteren. Hij is nuttig om te bevestigen of een UUID willekeurig of tijdgebaseerd is, om hem naar decimaal of Base64 te converteren voor een ander systeem, en om te zien of een nodeveld van een UUID v1 of v6 mogelijk een MAC-achtige identifier blootlegt.

De decoder draait in je browser en stuurt UUID-waarden niet naar een server. Hij accepteert canonieke UUID's, `urn:uuid:`-waarden, UUID's tussen accolades, invoer in hoofdletters en hexadecimale UUID's van 32 tekens zonder koppeltekens.

## Waarop letten

De versie- en variantvelden van UUID's beschrijven de bitindeling, niet of de identifier in de praktijk wereldwijd uniek is. Een geldig ogende UUID kan nog steeds dubbel voorkomen als hij slecht is gegenereerd of per ongeluk is gekopieerd.

Voor UUID's van versie 1 en versie 6 kan het nodeveld eruitzien als een MAC-adres. Moderne generators kunnen in plaats daarvan de multicastbit zetten en een willekeurige node gebruiken, dus behandel dit als een node-identificatie tenzij je de generator beheert.
