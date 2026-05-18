Genereer UUID v5-identificaties op basis van een namespace-UUID en een naam zonder een van beide waarden naar een server te sturen. UUID v5 is nuttig wanneer je een stabiele identificatie nodig hebt die later opnieuw kan worden gemaakt uit dezelfde invoer, zoals een ID voor een domeinnaam, URL, objectpad, accounthandle of fixture-record.

## How UUID v5 Works

UUID v5 combineert een namespace-UUID met een naamstring, hasht die bytes met SHA-1 en past vervolgens de versie- en variantbits van RFC 4122 toe. Omdat de invoer deterministisch is, levert `example.com` binnen de DNS-namespace altijd dezelfde UUID op: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Choosing A Namespace

Gebruik `ns:DNS` voor domeinnamen, `ns:URL` voor URL's, `ns:OID` voor objectidentificaties en `ns:X.500 DN` voor X.500 distinguished names. Je kunt ook je eigen UUID-namespace plakken wanneer je toepassing identificaties nodig heeft die zijn afgebakend tot een product, tenant, dataset of migratie.

## When To Use It

Kies UUID v5 wanneer reproduceerbaarheid belangrijker is dan willekeur. Het is geschikt voor deterministische imports, testfixtures, namespaced records en systemen waarbij hetzelfde logische item bij elke uitvoering dezelfde ID moet krijgen. Gebruik voor geheime tokens of onvoorspelbare publieke ID's in plaats daarvan een random generator.
