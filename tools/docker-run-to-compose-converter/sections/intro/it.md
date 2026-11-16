## Cosa fa

Il Convertitore Docker Run in Compose converte uno o più comandi `docker run` in un
file `docker-compose.yml` nel browser. Puoi esaminare il file YAML generato,
copiarlo o scaricarlo prima di inserirlo nel tuo progetto.

## Quando usarlo

Usalo per trasformare un comando per container creato al momento in una
definizione di servizio Compose riproducibile, oppure per vedere come porte,
volumi, variabili di ambiente e flag delle risorse vengono tradotti in Compose.

## Cosa aspettarsi

Le opzioni comuni, come porte, variabili di ambiente, criteri di riavvio,
controlli di integrità, punti di montaggio e limiti delle risorse, vengono conservate. I flag
non supportati o ambigui vengono segnalati con avvisi, così puoi controllare
l'output prima di usarlo.
