## Jämför två CID:er för IPFS-kataloger

Klistra in den ursprungliga mappen i **Tidigare mapp** och den uppdaterade i **Senare mapp**, och välj sedan **Jämför mappar**. Båda fälten tar emot en CID, en `ipfs://`-adress eller en HTTP-gatewaylänk. Lägg till en sökväg för att jämföra två undermappar. Öppna ett resultat för att se dess CID:er, filtrera listan efter sökväg eller ladda ner JSON för att spara jämförelsen.

## Vad räknas som en tillagd, borttagen eller ändrad sökväg?

En sökväg som bara finns i en av mapparna är tillagd eller borttagen. En hel tillagd eller borttagen undermapp visas som en enda sökväg. När båda versionerna innehåller en undermapp med olika CID:er jämför verktyget sökvägarna i den. En post vars CID ändras visas som ändrad. Filer som importerats med olika inställningar för uppdelning eller kodning kan få olika CID:er även om deras synliga innehåll är detsamma.

## Jämför IPFS-ögonblicksbilder utan att ladda ner varje fil

Webbläsaren läser verifierade IPFS-block från offentliga gatewayservrar och hoppar över grenar vars CID:er redan matchar. Det gör det möjligt att jämföra versioner av en webbplats, en publicerad datamängd eller en säkerhetskopia med hjälp av oföränderliga mappadresser. Ändrade länkar kan jämföras utan att de fullständiga filerna laddas ner. Om en mapppost inte är tillgänglig visar resultatet vilka sökvägar som inte kunde jämföras.

Läs mer om [innehållsadressering och datamängdsversioner](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
