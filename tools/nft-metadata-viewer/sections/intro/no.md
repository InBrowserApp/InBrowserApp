## Slå opp NFT-metadata med kontraktadresse og token-ID

Lim inn en **Kontraktadresse** på Ethereum-hovednettet og skriv inn **Token-ID**, og velg deretter **Vis metadata**. Token-ID-en kan være et desimaltall som `1` eller et heksadesimalt tall som `0x1`. Velg **Prøv et eksempel** for å se et fullstendig oppslag. Viseren gjør en skrivebeskyttet Ethereum RPC-forespørsel i nettleseren, slik at du kan slå opp et offentlig token uten å koble til en lommebok.

## Finn token-URI, bilde, egenskaper og JSON

Viseren leser `tokenURI` for ERC-721 eller `uri` for ERC-1155. **Token-URI** er strengen kontrakten returnerer. Viseren leser metadataene den peker til, og viser bilde, navn og egenskaper når feltene er tilgjengelige. Bruk **Rå JSON** for å undersøke eller kopiere det uendrede svaret. IPFS, HTTP, Arweave og data-URI-er med innebygd JSON støttes.

## Slik fungerer erstatning av token-ID i ERC-1155

En ERC-1155-kontrakt kan returnere en mal som deles av flere tokener. Viseren erstatter `{id}` med token-ID-en som 64 små heksadesimale sifre, utfylt med nuller til venstre og uten prefikset `0x`. Når malen endres, viser **Løst URI** adressen som hentes for tokenet. Den samme erstatningen brukes i forhåndsvisningsfelt som bildelenken.

## Hva hvis en token-URI vises uten bilde?

En kontrakt kan returnere en URI selv om nettverten eller IPFS-gatewayen er midlertidig utilgjengelig. Viseren lar deg kopiere URI-en når den ikke kan laste metadataene. Hvis JSON er tilgjengelig, kan du undersøke `image`-feltet og prøve kilden direkte. HTTP-verter kan også begrense forespørsler mellom ulike opphav, noe som påvirker hva en nettleser kan lese.

Se [ERC-721-standarden](https://eips.ethereum.org/EIPS/eip-721), [ERC-1155-metadataspesifikasjonen](https://eips.ethereum.org/EIPS/eip-1155#metadata) og [OpenSeas metadataveiledning](https://docs.opensea.io/docs/metadata-standards) for feltene som ofte brukes av NFT-apper.
