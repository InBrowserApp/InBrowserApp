## Panoramica

JSON Diff Path confronta due documenti JSON e trasforma ogni modifica
strutturale in un record di percorso leggibile, con output sia JSONPath sia
JSON Pointer.

## Quando usarlo

Usalo quando devi rivedere modifiche ai payload API, controllare migrazioni di
configurazione o generare operazioni JSON Patch RFC 6902 per l'automazione.

## Come funziona

Lo strumento analizza entrambi gli input JSON, calcola le modifiche `add`,
`remove` e `replace`, poi consente di filtrare quelle operazioni e passare tra
un elenco di percorsi e l'output JSON Patch nello stesso pannello dei
risultati.
