Erzeuge UUID-v5-Kennungen aus einer Namespace-UUID und einem Namen, ohne einen der Werte an einen Server zu senden. UUID v5 ist nützlich, wenn du eine stabile Kennung benötigst, die später aus derselben Eingabe erneut erstellt werden kann, etwa als ID für einen Domainnamen, eine URL, einen Objektpfad, ein Konto-Handle oder einen Fixture-Datensatz.

## How UUID v5 Works

UUID v5 kombiniert eine Namespace-UUID mit einer Namenszeichenfolge, hasht diese Bytes mit SHA-1 und wendet anschließend die Versions- und Variantenbits nach RFC 4122 an. Da die Eingabe deterministisch ist, erzeugt `example.com` im DNS-Namespace immer dieselbe UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Choosing A Namespace

Verwende `ns:DNS` für Domainnamen, `ns:URL` für URLs, `ns:OID` für Objektkennungen und `ns:X.500 DN` für X.500 Distinguished Names. Du kannst auch deinen eigenen UUID-Namespace einfügen, wenn deine Anwendung Kennungen benötigt, die auf ein Produkt, einen Mandanten, einen Datensatz oder eine Migration begrenzt sind.

## When To Use It

Wähle UUID v5, wenn Reproduzierbarkeit wichtiger ist als Zufälligkeit. Sie eignet sich gut für deterministische Importe, Test-Fixtures, namespaced Datensätze und Systeme, bei denen dasselbe logische Element über mehrere Läufe hinweg dieselbe ID erhalten muss. Für geheime Tokens oder nicht vorhersagbare öffentliche IDs solltest du stattdessen einen Zufallsgenerator verwenden.
