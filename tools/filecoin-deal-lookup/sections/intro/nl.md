## Een Filecoin-opslagdeal opzoeken met Deal ID

Voer de numerieke **Deal ID** van een Storage Market-deal op het Filecoin-mainnet in en selecteer **Deal opzoeken**. **Een voorbeeld proberen** laadt een echt openbaar record zodat je status, provider, klant, datums en Piece CID kunt bekijken. Deze zoekfunctie omvat Storage Market-deals. Filecoin Onchain Cloud gebruikt een aparte dataset-ID.

## De status van een Filecoin-deal begrijpen

Een actieve deal heeft een geregistreerde activatie en het geplande einde ligt nog in de toekomst. In afwachting betekent dat de deal tot en met het geplande begin-epoch op activatie wacht. De zoekfunctie toont ook wanneer de start zonder activatie is verstreken, de deal is verlopen of de marktstatus een bestraffing registreert. De begin- en einde-epochs komen uit het dealvoorstel. De UTC-datums worden berekend op basis van het epochschema van de chain.

## De Piece CID van de deal vergelijken met je bestand

De Piece CID is het geregistreerde commitment voor de Filecoin-piece. Kopieer deze om te vergelijken met een commitment dat je met de Filecoin Piece CID-calculator uit je lokale bestand of CAR hebt berekend. Het resultaat toont ook de opgevulde piece-grootte, gemeten na Filecoin-piecepadding. Een geverifieerde deal heeft de Filecoin Plus-verificatievlag.

## Oudere Filecoin-deals vinden

De browser raadpleegt eerst de huidige marktstatus op het Filecoin-mainnet. Nadat een record uit die status is verdwenen, kan de viewer de oorspronkelijke voorwaarden tonen die Filfox heeft geïndexeerd en deze als historisch record markeren. Die voorwaarden bevatten geplande datums en partijen. **Bekijken op Filfox** opent de explorer voor dezelfde Deal ID.

Zie de [Filecoin Storage Market RPC-referentie](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) voor de velden die de chain teruggeeft.
