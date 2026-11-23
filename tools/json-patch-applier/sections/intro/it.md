## Come applicare una JSON Patch

Incolla il documento JSON originale nel primo editor e un array JSON Patch RFC 6902 nel secondo. Seleziona **Applica patch** per visualizzare l’anteprima del JSON aggiornato e copiarlo. Per generare una patch, confronta il documento originale e quello modificato in [JSON Diff Path](../json-diff-path/) e copia il risultato in formato **JSON Patch**. Applica la patch allo stesso documento originale.

## Esempio di JSON Patch

Il documento originale contiene uno stato e un tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Questa patch verifica lo stato iniziale, lo aggiorna e aggiunge un tag.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Il risultato è `{"status":"published","tags":["api","release"]}`.

## Operazioni supportate e sintassi JSON Pointer

- `add` crea o sovrascrive una proprietà di un oggetto, inserisce un elemento in un array o sostituisce l’intero documento alla radice.
- `remove` elimina un valore esistente. `replace` sostituisce un valore esistente con uno nuovo.
- `move` preleva un valore esistente dal puntatore `from` e lo inserisce in `path`. `copy` inserisce una copia indipendente.
- `test` verifica che il valore in `path` sia uguale al valore `value` specificato, senza modificare il documento.

I percorsi utilizzano JSON Pointer, definito nella RFC 6901. Gli indici degli array partono da zero. Perciò `/tags/0` indica il primo tag e `/tags/-` aggiunge un valore in fondo all’array quando l’operazione prevede un inserimento. Usa `~1` per una barra e `~0` per una tilde all’interno della chiave di un oggetto. Per esempio, `/a~1b` indica la chiave `a/b`. Il percorso vuoto `""` indica l’intero documento, mentre `/` indica una proprietà con chiave vuota.

## Perché un’operazione JSON Patch può non riuscire

Le operazioni vengono eseguite nell’ordine in cui compaiono nell’array e ciascuna lavora sul risultato delle precedenti. Se il percorso di destinazione non esiste, un indice è oltre i limiti dell’array o un valore di `test` è diverso da quello atteso, lo strumento evidenzia la prima operazione non riuscita e si ferma. L’anteprima del JSON compare solo se tutta la patch viene applicata con successo. Un array di patch vuoto `[]` restituisce il documento originale.

Il browser applica la patch in locale. Il JSON originale e la patch restano nel browser.
