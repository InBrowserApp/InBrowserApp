## Slik bruker du en JSON Patch

Lim inn det opprinnelige JSON-dokumentet i det første redigeringsfeltet, og listen med RFC 6902 JSON Patch-operasjoner i det andre. Velg **Bruk patch** for å forhåndsvise og kopiere den oppdaterte JSON-en. Hvis du vil lage en patch, kan du sammenligne det opprinnelige og det endrede dokumentet i [JSON-sammenligning med stier](../json-diff-path/) og kopiere resultatet fra **JSON Patch**. Bruk deretter patchen på det samme opprinnelige dokumentet.

## Eksempel på JSON Patch

Det opprinnelige dokumentet inneholder en status og en tagg.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Denne patchen sjekker og oppdaterer den opprinnelige statusen og legger til en tagg.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Resultatet blir `{"status":"published","tags":["api","release"]}`.

## Støttede operasjoner og syntaks for JSON Pointer

- `add` oppretter eller overskriver et objektfelt, setter inn et listeelement eller erstatter hele dokumentet på rotnivå.
- `remove` sletter en eksisterende verdi. `replace` erstatter en eksisterende verdi med en ny.
- `move` tar en eksisterende verdi fra pekeren `from` og setter den inn på `path`. `copy` setter inn en uavhengig kopi.
- `test` sjekker om verdien på `path` er lik den oppgitte verdien i `value` uten å endre dokumentet.

Stiene bruker JSON Pointer i henhold til RFC 6901. Indekser i lister starter på null. Dermed peker `/tags/0` på den første taggen, mens `/tags/-` legger en verdi sist i listen ved en innsettingsoperasjon. Bruk `~1` for skråstrek og `~0` for tilde i en objektnøkkel. For eksempel peker `/a~1b` på nøkkelen `a/b`. En tom sti `""` peker på hele dokumentet, mens `/` peker på et felt med tom nøkkel.

## Hvorfor en JSON Patch-operasjon mislykkes

Operasjonene kjøres i listens rekkefølge. Hver operasjon bruker resultatet fra de foregående operasjonene. Hvis et mål mangler, en indeks er utenfor listen, eller en `test`-verdi avviker, markeres den første feilen og behandlingen stopper. En JSON-forhåndsvisning vises når hele patchen lykkes. En tom patchliste `[]` gir tilbake det opprinnelige dokumentet.

Nettleseren bruker patchen lokalt. Både det opprinnelige JSON-dokumentet og patchen blir i nettleseren.
