## Convertire domini Unicode e Punycode

Incolla un dominio come `bücher.com` in **Dominio Unicode** per ottenere `xn--bcher-kva.com` in **Dominio ASCII**. Incolla un dominio con prefisso `xn--` in **Dominio ASCII** per leggerlo in Unicode. I due campi si aggiornano mentre scrivi e puoi copiare il risultato da entrambi.

## Quando usare ciascun formato

Punycode rappresenta i caratteri non ASCII dei nomi di dominio internazionalizzati (IDN) usando lettere, cifre e trattini ASCII. Una parte del dominio convertita inizia con `xn--`, mentre le parti già in ASCII, come `com`, rimangono uguali. Usa la versione ASCII nelle impostazioni DNS o di hosting che la richiedono e quella Unicode per leggere un dominio in un log o in un file di configurazione.

## Cosa incollare nel convertitore

Inserisci solo il nome host. Se hai `https://bücher.com/catalog`, incolla `bücher.com`. Puoi includere i sottodomini. Per esempio, `www.bücher.com` diventa `www.xn--bcher-kva.com`.
