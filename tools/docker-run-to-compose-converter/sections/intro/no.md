## Hva verktøyet gjør

Docker Run til Compose-omformeren konverterer én eller flere `docker run`-kommandoer til en
`docker-compose.yml`-fil i nettleseren. Du kan se gjennom den genererte YAML-koden,
kopiere den eller laste den ned før du tar den inn i prosjektet ditt.

## Når du bør bruke det

Bruk det når du vil gjøre en enkeltstående containerkommando om til en gjenbrukbar
Compose-tjenestedefinisjon, eller når du vil se hvordan porter, volumer,
miljøvariabler og ressursflagg overføres til Compose.

## Hva du kan forvente

Vanlige innstillinger som porter, miljøvariabler, omstartspolicy,
helsesjekker, monteringer og ressursgrenser bevares. Flagg som ikke støttes,
eller som er tvetydige, vises som advarsler, slik at du kan gjennomgå resultatet
før du bruker det.
