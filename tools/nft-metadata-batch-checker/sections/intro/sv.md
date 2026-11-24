## Validera NFT-metadata i JSON före mintning

Välj **Lokala filer** för att kontrollera enskilda JSON-filer eller en samlingsmapp på din enhet. Välj numrerade filer som `1` eller `42` direkt. Verktyget rapporterar ogiltig JSON och vanliga metadataproblem för varje objekt, bland annat tomma namn, bilder som saknas, ogiltiga beskrivningar och felaktigt formade attribut. Använd **Behöver granskas** för att hitta poster som behöver rättas, eller ladda ner hela rapporten som JSON.

## Kontrollera flera token-URI:er samtidigt

Klistra in en metadataadress per rad under **Token-URI:er**. För numrerade samlingar använder du **URI-mönster** med en platshållare som `https://example.com/metadata/{id}.json`. Ange första och sista ID för att kontrollera ett intervall där båda ingår. Det decimala formatet använder ID:t som det skrivs. **ERC-1155 hex** skriver varje ID med 64 gemena hexadecimala tecken och inledande nollor, enligt ERC-1155:s specifikation för ersättning av `{id}`. Den ersätter också `{id}` i metadatavärden som bildlänkar.

## Kontrollera länkar till NFT-bilder och animationer

Aktivera **Kontrollera medietillgänglighet** för att kontrollera länkarna `image` och `animation_url`. Välj hela den lokala mappen för att inkludera medier som anges med relativa sökvägar. En sökväg som börjar med `/` löses från den valda mappens översta nivå. Webbläsaren kan även kontrollera HTTP-, IPFS- och Arweave-resurser. Ett gatewayfel, en tidsgräns eller en begränsning mellan ursprung kan göra att en länk inte kan bekräftas. Granska de länkarna i den gateway eller marknadsplats du använder. Kontroller av lokala filer körs i webbläsaren, medan URI-kontroller kontaktar relevant värd eller gateway.

Se [OpenSeas metadataguide](https://docs.opensea.io/docs/metadata-standards) och [ERC-1155:s metadataspecifikation](https://eips.ethereum.org/EIPS/eip-1155#metadata) för fältdefinitioner och ersättning i token-URI:er.
