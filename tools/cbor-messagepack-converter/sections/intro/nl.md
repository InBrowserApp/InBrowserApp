## Binaire API-gegevens inspecteren

CBOR en MessagePack zijn compacte binaire serialisatieformaten voor gestructureerde gegevens. Gebruik deze converter om API-antwoorden, WebSocket-berichten of waarden in de cache als JSON te inspecteren, of om binaire gegevens van JSON te maken voor het debuggen. Alles wordt in je browser verwerkt; invoer wordt niet geüpload of opgeslagen.

## JSON coderen of bytes decoderen

Kies het binaire formaat en de conversierichting. Voer JSON in om te coderen en kies Hex, Base64 of Base64URL voor de uitvoer. Plak bytes om te decoderen en selecteer hun invoercodering. Als je de invoercodering wijzigt, wordt de tekst die al in de editor staat opnieuw geïnterpreteerd.

Open een JSON-bestand bij het coderen, of een onbewerkt `.cbor`-, `.msgpack`- of `.bin`-bestand bij het decoderen. Gecodeerde tekst zoals Hex of Base64 moet in de editor worden geplakt. Converteer de invoer en kopieer daarna de weergegeven tekst of download het resultaat. Binaire downloads bevatten de daadwerkelijke bytes en kunnen opnieuw worden geïmporteerd.

## Waarden behouden en de beperkingen begrijpen

Bij gehele getalliteralen blijft elk cijfer behouden binnen het door het formaat ondersteunde 64-bitsbereik. Waarden die JSON niet kan weergeven, zoals binaire velden, CBOR-tags en MessagePack-extensies, verschijnen als objecten met een expliciet type. Schakel Uitgebreide JSON in om die objecten weer naar binair te coderen; laat dit uitgeschakeld voor gewone JSON-objecten die toevallig speciale typesleutels gebruiken.

Met Uitgebreide JSON ingeschakeld codeert `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` bijvoorbeeld een exact geheel getal en twee binaire bytes.

Elke conversie verwerkt één waarde, met een invoerlimiet van 1 MiB. «Geformatteerde JSON-bytes» telt de weergegeven, leesbaar opgemaakte JSON in plaats van de oorspronkelijke invoer. Opnieuw coderen behoudt ondersteunde waarden, maar kan de volgorde van maps of de keuze van binaire codering wijzigen. Open hierboven «Formaten en behoud van typen» voor de syntaxis van typeobjecten en niet-ondersteunde typen.
