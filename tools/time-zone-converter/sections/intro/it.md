## A cosa serve questo strumento

Usa questo convertitore per trasformare una data e ora locale in un fuso orario IANA nell'ora locale equivalente di un altro fuso. È utile quando devi confrontare orari tra città diverse senza sommare manualmente gli offset né indovinare se l'ora legale sia attiva.

## Casi d'uso comuni

- Verificare se una riunione a Tokyo cade nello stesso giorno di calendario a New York o Londra.
- Verificare gli offset prima di pubblicare orari, avvisi o fasce di supporto.
- Copiare i valori ISO 8601, UTC o Unix timestamp corrispondenti per log e API.

## Come funziona questo convertitore

- Inserisci una data e ora locale nel formato `YYYY-MM-DD HH:mm:ss.SSS` da uno dei due lati, quindi scegli i fusi orari di origine e destinazione.
- Il lato modificato più di recente diventa il riferimento. Lo strumento converte internamente quell'istante in UTC e poi mostra l'ora locale equivalente nell'altro fuso.
- Usa `Now` per inserire rapidamente l'ora attuale, oppure `Swap` per invertire il confronto. Gli offset possono cambiare durante le transizioni dell'ora legale.
