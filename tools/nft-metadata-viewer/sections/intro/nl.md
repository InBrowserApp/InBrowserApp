## NFT-metadata opzoeken met contractadres en token-ID

Plak een **Contractadres** op het Ethereum-mainnet en voer de **Token-ID** in. Selecteer daarna **Metadata bekijken**. De token-ID kan een decimaal getal zijn zoals `1` of een hexadecimaal getal zoals `0x1`. Selecteer **Een voorbeeld proberen** om een volledige zoekopdracht te bekijken. De viewer voert in je browser een alleen-lezen Ethereum RPC-verzoek uit, zodat je een openbaar token kunt opzoeken zonder een wallet te koppelen.

## De token-URI, afbeelding, kenmerken en JSON vinden

De viewer leest `tokenURI` voor ERC-721 of `uri` voor ERC-1155. De **Token-URI** is de tekenreeks die het contract teruggeeft. De viewer leest de metadata waarnaar die verwijst en toont de afbeelding, naam en kenmerken als die velden beschikbaar zijn. Gebruik **Ruwe JSON** om het ongewijzigde antwoord te bekijken of te kopiëren. IPFS, HTTP, Arweave en ingesloten JSON-data-URI’s worden ondersteund.

## Hoe ERC-1155-token-ID-vervanging werkt

Een ERC-1155-contract kan een sjabloon teruggeven dat door meerdere tokens wordt gedeeld. De viewer vervangt `{id}` door de token-ID als 64 kleine hexadecimale cijfers, links aangevuld met nullen en zonder het voorvoegsel `0x`. Als het sjabloon verandert, toont **Opgeloste URI** het adres dat voor dat token wordt opgehaald. Dezelfde vervanging wordt gebruikt in voorbeeldvelden zoals de afbeeldingslink.

## Wat als een token-URI verschijnt zonder afbeelding?

Een contract kan een URI teruggeven terwijl de webhost of IPFS-gateway tijdelijk niet beschikbaar is. De viewer houdt de URI beschikbaar om te kopiëren als de metadata niet kan worden geladen. Als de JSON beschikbaar is, bekijk dan het veld `image` en probeer de bron rechtstreeks. HTTP-hosts kunnen ook cross-origin-verzoeken beperken, wat invloed heeft op wat een browser kan lezen.

Zie de [ERC-721-standaard](https://eips.ethereum.org/EIPS/eip-721), de [ERC-1155-metadataspecificatie](https://eips.ethereum.org/EIPS/eip-1155#metadata) en de [OpenSea-metadatagids](https://docs.opensea.io/docs/metadata-standards) voor de velden die NFT-apps vaak gebruiken.
