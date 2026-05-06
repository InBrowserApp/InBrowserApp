## Wat deze tool toont

Apparaatinformatie verzamelt de details die de browser kan zien van het apparaat dat je nu gebruikt. De resultaten worden gegroepeerd in secties voor browser, weergave, hardware, netwerk, opslag en mogelijkheden, zodat je snel ziet wat een website kan detecteren zonder diagnostische software te installeren.

## Wanneer het helpt

Gebruik het wanneer je responsieve lay-outs moet debuggen, supporttickets wilt reproduceren, browsers wilt vergelijken, wilt bevestigen of cookies of local storage beschikbaar zijn, schermafmetingen wilt controleren of een compacte JSON-snapshot voor een bugrapport wilt vastleggen. Het is ook nuttig voordat je canvas-, WebGL-, klembord-, service-worker- of opslagafhankelijke functies test.

## Opmerkingen over privacy en nauwkeurigheid

De tool draait volledig in je browser en uploadt de snapshot niet. Browsers verbergen of ronden sommige waarden bewust af, vooral gegevens over geheugen, CPU, GPU, netwerk en user agent. Ontbrekende waarden betekenen meestal dat de browser die API niet beschikbaar stelt, dat de pagina zich niet in een veilige context bevindt of dat een privacyinstelling de toegang heeft geblokkeerd.

## Zo lees je de resultaten

Beschouw de gegevens als de huidige weergave van je omgeving door de browser, niet als een gegarandeerde hardware-inventaris. Wijzig de venstergrootte of draai het apparaat en vernieuw daarna de snapshot om viewport-, oriëntatie- en schermwaarden bij te werken. Gebruik de JSON-kopieeractie wanneer je de exact waargenomen waarden met een ontwikkelaar of supportteam moet delen.
