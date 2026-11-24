## Beräkna en CID för en fil eller mapp

Välj en lokal fil eller mapp och välj sedan **Beräkna CID**. Kopiera innehållsidentifieraren (CID) för att spara den i ett manifest eller jämföra den med en tidigare IPFS-import. Beräkningen sker i webbläsaren. Filerna stannar på din enhet och publiceras inte på IPFS.

## Varför kan samma fil ha olika IPFS-CID:er?

IPFS kan dela upp en fil i block och lagra länkar mellan dem med UnixFS. Rot-CID:n beror på hur blocken delas upp, kodas och ordnas. För att återskapa en CID använder du samma chunkstorlek, inställning för råa lövblock och mappstruktur som vid den ursprungliga importen. En mapps CID innehåller även namnen på dess poster. Webbläsarens mappväljare utelämnar tomma undermappar.

## Återskapa CID:n med Kubo

Öppna **Importinställningar** för att ändra CID-version, chunkstorlek, inställningen för råa lövblock eller omslutning med en mapp. CIDv1 är standard. Använd CIDv0 för att matcha en äldre import som använde den versionen. **Omslut med en mapp** lägger till en yttre katalog så att du kan adressera filen med dess namn under rot-CID:n.

Kopiera det visade kommandot `ipfs add --only-hash` för att återskapa beräkningen för samma fil eller mapp i Kubo. Om du har en CID från en tidigare import kan du klistra in den i jämförelsefältet. En likvärdig CIDv0 och CIDv1 matchar eftersom de identifierar samma block. [IPFS-dokumentation om innehållsidentifierare](https://docs.ipfs.tech/concepts/content-addressing/)
