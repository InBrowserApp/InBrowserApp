## Så tillämpar du en JSON Patch

Klistra in det ursprungliga JSON-dokumentet i den första redigeraren och RFC 6902 JSON Patch-arrayen i den andra. Välj **Tillämpa patch** för att förhandsgranska och kopiera uppdaterad JSON. Skapa en patch genom att jämföra det ursprungliga och det ändrade dokumentet i [Sökvägsbaserad JSON-jämförelse](../json-diff-path/) och kopiera resultatet från **JSON Patch**. Tillämpa sedan patchen på samma ursprungliga dokument.

## Exempel på JSON Patch

Det ursprungliga dokumentet innehåller en status och en tagg.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Den här patchen kontrollerar och uppdaterar den ursprungliga statusen och lägger till en tagg.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Resultatet blir `{"status":"published","tags":["api","release"]}`.

## Operationer som stöds och syntax för JSON Pointer

- `add` skapar eller skriver över ett objektfält, infogar ett element i en array eller ersätter hela dokumentet vid roten.
- `remove` tar bort ett befintligt värde. `replace` ersätter ett befintligt värde med ett nytt.
- `move` tar ett befintligt värde från pekaren `from` och infogar det vid `path`. `copy` infogar en oberoende kopia.
- `test` kontrollerar om värdet vid `path` är lika med det angivna värdet i `value` utan att ändra dokumentet.

Sökvägarna använder JSON Pointer enligt RFC 6901. Arrayindex börjar på noll. Därför syftar `/tags/0` på den första taggen, medan `/tags/-` lägger till ett värde sist i arrayen vid en tilläggsoperation. Använd `~1` för snedstreck och `~0` för tilde i en objektnyckel. Exempelvis syftar `/a~1b` på nyckeln `a/b`. En tom sökväg `""` syftar på hela dokumentet, medan `/` syftar på ett fält med tom nyckel.

## Varför en JSON Patch-operation misslyckas

Operationerna körs i arrayens ordning. Varje operation utgår från resultatet av de tidigare operationerna. Om ett mål saknas, ett arrayindex ligger utanför giltigt intervall eller ett `test`-värde avviker, markeras det första felet och bearbetningen stoppas. JSON-förhandsgranskningen visas när hela patchen lyckas. En tom patch-array `[]` returnerar det ursprungliga dokumentet.

Webbläsaren tillämpar patchen lokalt. Det ursprungliga JSON-dokumentet och patchen stannar i webbläsaren.
