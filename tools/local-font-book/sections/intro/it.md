## Che cos'è Local Font Access?

Local Font Access è un'API del browser che elenca i font installati sul dispositivo.

Questo strumento ti permette di cercare nei risultati, confrontare varianti correlate e copiare uno snippet CSS per il font scelto.

Funziona solo in contesti sicuri e browser supportati, con permesso utente (local-fonts).

L'API restituisce FontData con family, fullName, postscriptName e style.

### Punti chiave

- Usalo per confermare i nomi esatti da usare in uno stack CSS `font-family` sul dispositivo attuale.
- Le chiamate devono essere avviate da un gesto dell'utente.
- Permissions Policy può bloccare l'accesso su alcuni siti.
- Questo strumento resta locale e non carica font.
