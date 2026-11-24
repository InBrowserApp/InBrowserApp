## NFT-metadata in JSON valideren vóór het minten

Kies **Lokale bestanden** om afzonderlijke JSON-bestanden of een collectiemap op je apparaat te controleren. Kies genummerde bestanden zoals `1` of `42` rechtstreeks. De checker meldt per item ongeldige JSON en veelvoorkomende metadataproblemen, waaronder lege namen, ontbrekende afbeeldingen, ongeldige beschrijvingen en onjuist gevormde attributen. Gebruik **Controleren** om items te vinden die je moet aanpassen, of download het volledige rapport als JSON.

## Token-URI’s in bulk controleren

Plak onder **Token-URI’s** één metadata-adres per regel. Gebruik voor genummerde collecties **URI-patroon** met een plaatsaanduiding zoals `https://example.com/metadata/{id}.json`. Stel de eerste en laatste ID in om een inclusief bereik te controleren. Het decimale formaat gebruikt de ID zoals die is geschreven. **ERC-1155 hex** schrijft elke ID als 64 kleine hexadecimale tekens met voorloopnullen, zoals voorgeschreven voor de ERC-1155-vervanging van `{id}`. Ook wordt `{id}` vervangen in metadatawaarden zoals afbeeldingslinks.

## Links naar NFT-afbeeldingen en -animaties controleren

Schakel **Beschikbaarheid van media controleren** in om `image`- en `animation_url`-links te controleren. Selecteer de volledige lokale map om media met relatieve paden mee te nemen. Een pad dat met `/` begint, wordt opgelost vanaf het hoogste niveau van de geselecteerde map. De browser kan ook HTTP-, IPFS- en Arweave-bronnen controleren. Door een gatewayfout, time-out of cross-origin-beperking kan een link onbevestigd blijven. Controleer die links in de gateway of marktplaats die je gebruikt. Controles van lokale bestanden vinden plaats in de browser; URI-controles nemen contact op met de betreffende host of gateway.

Zie de [OpenSea-metadatagids](https://docs.opensea.io/docs/metadata-standards) en de [ERC-1155-metadataspecificatie](https://eips.ethereum.org/EIPS/eip-1155#metadata) voor velddefinities en de vervanging in token-URI’s.
