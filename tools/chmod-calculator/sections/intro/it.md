## Che cos'è chmod?

`chmod` ("change mode") è un comando Unix/Linux per modificare i permessi di file e directory. Questo calcolatore ti permette di passare tra permessi numerici come `755`, permessi simbolici come `rwxr-xr-x` e la matrice di caselle senza fare i conti a mente.

## Come funzionano i permessi numerici

Ogni cifra rappresenta un ruolo: proprietario, gruppo e altri. Dentro ogni cifra, `4` significa lettura, `2` scrittura e `1` esecuzione. Somma questi valori per ottenere il permesso desiderato: `7 = rwx`, `6 = rw-`, `5 = r-x` e `4 = r--`. Per le directory, il bit di esecuzione permette anche di entrarvi.

## Esempi comuni di chmod

- `chmod 755 script.sh` dà al proprietario accesso completo e permette agli altri di leggere ed eseguire.
- `chmod 644 notes.txt` mantiene il file modificabile dal proprietario mentre gli altri possono solo leggerlo.
- `chmod 600 .env` è una scelta comune per segreti privati perché solo il proprietario può leggere o scrivere.
- `chmod 775 shared-folder` è utile per directory condivise quando anche il gruppo deve poter creare e modificare file.
