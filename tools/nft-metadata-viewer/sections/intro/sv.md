## Slå upp NFT-metadata med kontraktsadress och token-ID

Klistra in en **Kontraktsadress** på Ethereums huvudnät och ange **Token-ID**, välj sedan **Visa metadata**. Token-ID:t kan vara ett decimalt tal som `1` eller ett hexadecimalt tal som `0x1`. Välj **Prova ett exempel** för att se en fullständig sökning. Visaren gör en skrivskyddad Ethereum RPC-förfrågan i webbläsaren, så att du kan slå upp en offentlig token utan att ansluta en plånbok.

## Hitta token-URI, bild, egenskaper och JSON

Visaren läser `tokenURI` för ERC-721 eller `uri` för ERC-1155. **Token-URI** är strängen som kontraktet returnerar. Visaren läser metadata som den pekar på och visar bild, namn och egenskaper när dessa fält finns tillgängliga. Använd **Rå JSON** för att granska eller kopiera det oförändrade svaret. IPFS, HTTP, Arweave och data-URI:er med inbäddad JSON stöds.

## Så fungerar ersättning av token-ID i ERC-1155

Ett ERC-1155-kontrakt kan returnera en mall som delas av flera token. Visaren ersätter `{id}` med token-ID:t som 64 gemena hexadecimala siffror, utfyllt med nollor till vänster och utan prefixet `0x`. När mallen ändras visar **Upplöst URI** adressen som hämtas för tokenet. Samma ersättning används i förhandsvisningsfält som bildlänken.

## Vad händer om en token-URI visas utan bild?

Ett kontrakt kan returnera en URI även när webbvärden eller IPFS-gatewayservern tillfälligt inte är tillgänglig. Visaren låter dig kopiera URI:n när metadata inte kan laddas. Om JSON finns tillgänglig kan du granska fältet `image` och prova källan direkt. HTTP-värdar kan också begränsa förfrågningar mellan olika ursprung, vilket påverkar vad en webbläsare kan läsa.

Se [ERC-721-standarden](https://eips.ethereum.org/EIPS/eip-721), [ERC-1155:s metadataspecifikation](https://eips.ethereum.org/EIPS/eip-1155#metadata) och [OpenSeas metadataguide](https://docs.opensea.io/docs/metadata-standards) för de fält som ofta används av NFT-appar.
