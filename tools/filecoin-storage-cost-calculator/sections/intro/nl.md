## Opslagkosten van Filecoin Onchain Cloud schatten

Voer de datagrootte, **Bewaartermijn (dagen)** en het aantal **Kopieën** in. De calculator schat de opslagkosten van een nieuwe dataset per kopie met Filecoin Warm Storage Service. Hij toont het maandtarief voor opslag en bewijsdienst, de uitgaven voor de gekozen termijn en de kosten voor het aanmaken van datasets en toevoegen van pieces. Bedragen zijn in USDFC. Een prijsmaand bij Filecoin duurt 30 dagen.

## Hoe de opslagschatting wordt berekend

Elke actieve dataset betaalt een opslagtarief op basis van grootte plus een vast bedrag voor Proof of Data Possession (PDP). Bij bijvoorbeeld een opslagtarief van 2,50 USDFC per TiB en een bewijstarief van 0,12 USDFC per kopie kost één TiB met twee kopieën ongeveer 5,24 USDFC per 30 dagen. De schatting gebruikt de ingevoerde datagrootte. Filecoin leidt de exacte gefactureerde grootte af van datadragende bladeren; die kunnen tot 31 bytes per piece toevoegen.

## Uploadkosten en de terugbetaalbare reserve plannen

Open **Uploaddetails** om het aantal pieces en uploadbatches per kopie in te voeren. De schatting begint met één batch per kopie. Laat het aantal pieces leeg om het minimum te schatten op basis van de uploadlimiet van 63,5 GiB van de Synapse SDK, of voer je werkelijke aantallen in. Elke kopie heeft eigen kosten voor het aanmaken van een dataset; voor het toevoegen van pieces geldt een basisbedrag per batch plus een bedrag per piece. De levenscyclusreserve is een saldo dat de dienst aanhoudt voor operaties. De getoonde reserve staat los van de geschatte uitgaven; ongebruikte middelen komen na afrekening vrij. Deze schatting dekt een nieuwe upload en de bijbehorende opslagtermijn. Ophalen en latere operaties hebben eigen kosten. Zie de [groottebeperkingen van de Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Waar de Filecoin-tarieven vandaan komen

De pagina rekent met de gedateerde referentietarieven naast het resultaat. Selecteer **Mainnettarieven vernieuwen** om het Warm Storage-prijscontract via een openbare Filecoin RPC uit te lezen. De browser gebruikt de teruggegeven tarieven en toont het blok waaruit ze komen. Je kunt met de referentietarieven rekenen, ook als dat verzoek niet beschikbaar is.

Lees de [Filecoin-gids voor opslagkosten](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) voor exact gefactureerde groottes, accountspecifieke financiering en het volledige tarievenoverzicht.
