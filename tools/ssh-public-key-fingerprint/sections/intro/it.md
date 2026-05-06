## Che cos'è un fingerprint di chiave pubblica SSH?

Un fingerprint di chiave pubblica SSH è un breve digest del blob della chiave pubblica. Ti fornisce un valore compatto da confrontare prima di considerare attendibile una chiave in `authorized_keys`, in un inventario server o in un flusso di distribuzione.

OpenSSH mostra comunemente fingerprint SHA-256 come `SHA256:...`. La documentazione più vecchia e alcuni audit usano ancora fingerprint MD5 separati da due punti. Questo strumento mostra entrambi, così puoi confrontare l'output SSH moderno e i record legacy senza inviare la chiave da nessuna parte.

Incolla una singola chiave pubblica, più righe `authorized_keys` o un blocco di chiave pubblica SSH2. Il parser salta commenti e opzioni authorized_keys, legge il vero blob della chiave SSH e calcola i fingerprint localmente nel browser.

- Verifica che una chiave pubblica copiata corrisponda al fingerprint condiviso da un collega.
- Confronta le voci `authorized_keys` con una lista di accesso del server.
- Controlla tipo di chiave, dimensione della chiave, curva e commento prima di copiare un fingerprint.
