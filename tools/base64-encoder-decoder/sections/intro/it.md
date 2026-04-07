## Cos'è il Base64?

Base64 è utile quando un canale testuale deve trasportare payload binari, come corpi di email, blob JSON o piccoli data URL. È un livello di codifica, non di sicurezza.

## Quando usarlo

- Debug rapido quando un API restituisce o si aspetta stringhe Base64.
- Conversione di testo del browser in un formato di trasporto sicuro per log o payload.
- Verifica che un blob Base64 incollato si decodifichi nel contenuto atteso.

## Cosa tenere a mente

- Base64 aumenta la dimensione di circa un terzo.
- Non cifra né nasconde il valore originale.
- Un padding non valido o un copia-incolla interrotto si manifestano di solito come errore di decodifica.
