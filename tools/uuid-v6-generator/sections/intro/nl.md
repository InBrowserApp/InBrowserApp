UUID v6-generator maakt tijdgebaseerde UUID's die de vertrouwde UUID-vorm behouden en de tijdstempel vooraan plaatsen voor natuurlijke lexicale sortering. De tool draait volledig in je browser, zodat gegenereerde identificatiecodes en optionele node-waarden de pagina nooit verlaten.

## Wanneer UUID v6 helpt

Gebruik UUID v6 wanneer je identificatiecodes nodig hebt die breed compatibel blijven met UUID-tooling, maar ook dicht bij de aanmaakvolgorde sorteren in logs, database-indexen, eventstreams of migratiescripts. UUID v6 staat semantisch het dichtst bij UUID v1: het gebruikt een gregoriaanse tijdstempel, een kloksequentie en een 48-bits nodeveld, maar herschikt de tijdstempelbits zodat nieuwere ID's na oudere ID's sorteren.

## Node-ID's en privacy

Klassieke UUID v1-generators gebruiken vaak een echt MAC-adres als nodeveld. Deze tool gebruikt standaard voor elke gegenereerde UUID een willekeurige, lokaal beheerde node-ID, zodat er geen hardwareadres wordt blootgegeven. Schakel alleen over op een aangepaste node wanneer je bewust v1-compatibele uitvoer nodig hebt voor testfixtures, interoperabiliteitscontroles of gecontroleerde systemen.

## Kloksequentie en aangepaste tijd

De kloksequentie helpt botsingen te voorkomen wanneer tijdstempels zich herhalen of klokken achteruit lopen. De standaard willekeurige sequentie is het veiligst voor normaal gebruik. Aangepaste tijdstempels, node-ID's en kloksequenties zijn handig voor deterministische voorbeelden, maar herhaalde aangepaste waarden moeten voorzichtig worden gebruikt in productiegegevens.
