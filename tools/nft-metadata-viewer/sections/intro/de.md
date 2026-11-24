## NFT-Metadaten per Vertragsadresse und Token-ID abrufen

Fügen Sie eine **Vertragsadresse** aus dem Ethereum-Mainnet ein und geben Sie die **Token-ID** an. Wählen Sie anschließend **Metadaten anzeigen**. Die Token-ID kann eine Dezimalzahl wie `1` oder eine Hexadezimalzahl wie `0x1` sein. Wählen Sie **Beispiel ausprobieren**, um einen vollständigen Abruf zu sehen. Der Betrachter sendet aus Ihrem Browser eine lesende RPC-Anfrage an Ethereum. So können Sie öffentliche Token abfragen, ohne eine Wallet zu verbinden.

## Token-URI, Bild, Merkmale und JSON finden

Der Betrachter liest `tokenURI` für ERC-721 oder `uri` für ERC-1155. Die **Token-URI** ist die vom Vertrag zurückgegebene Zeichenfolge. Der Betrachter liest die Metadaten, auf die sie verweist, und zeigt das Bild, den Namen und die Merkmale an, sofern die Felder verfügbar sind. Unter **JSON-Rohdaten** können Sie die unveränderte Antwort prüfen oder kopieren. Unterstützt werden IPFS-, HTTP- und Arweave-URIs sowie Daten-URIs mit eingebettetem JSON.

## Wie die Ersetzung der Token-ID bei ERC-1155 funktioniert

Ein ERC-1155-Vertrag kann eine Vorlage zurückgeben, die mehrere Token gemeinsam nutzen. Der Betrachter ersetzt `{id}` durch die Token-ID als 64 kleingeschriebene Hexadezimalziffern mit führenden Nullen und ohne Präfix `0x`. Wenn sich die Vorlage durch die Ersetzung ändert, zeigt **Aufgelöste URI** die für diesen Token abgerufene Adresse an. Dieselbe Ersetzung gilt in Vorschaufeldern wie dem Bildlink.

## Was tun, wenn eine Token-URI ohne Bild erscheint?

Ein Vertrag kann eine URI zurückgeben, wenn der Webhost oder das IPFS-Gateway vorübergehend nicht erreichbar ist. Auch wenn sich die Metadaten nicht laden lassen, können Sie die URI im Betrachter kopieren. Wenn die JSON-Daten verfügbar sind, prüfen Sie das Feld `image` und rufen Sie die Quelle direkt auf. HTTP-Hosts können außerdem Cross-Origin-Anfragen beschränken und damit begrenzen, welche Daten der Browser lesen kann.

Informationen zu den in NFT-Apps üblichen Feldern finden Sie im [ERC-721-Standard](https://eips.ethereum.org/EIPS/eip-721), in der [ERC-1155-Metadatenspezifikation](https://eips.ethereum.org/EIPS/eip-1155#metadata) und im [OpenSea-Metadatenleitfaden](https://docs.opensea.io/docs/metadata-standards).
