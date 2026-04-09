## Czym jest OpenAPI To TypeScript Converter?

OpenAPI to TypeScript Converter zamienia dokument OpenAPI 3.x na wygenerowane typy TypeScript bezpośrednio w przeglądarce. Jest przydatny, gdy chcesz szybko podejrzeć typy, pobrać plik deklaracji albo bezpiecznie przetestować opcje `openapi-typescript` bez wysyłania schematu na serwer.

## Kiedy Go Używać

Użyj tego narzędzia, gdy masz już schemat OpenAPI w JSON lub YAML i chcesz typowane modele żądań i odpowiedzi do aplikacji frontendowych, prototypów SDK albo przeglądów API. Jest szczególnie pomocne przy porównywaniu opcji generowania przed zapisaniem wyniku w repozytorium.

## Zanim Wygenerujesz

Ta przepisana wersja w przeglądarce obsługuje zbundlowane dokumenty OpenAPI 3.0 i 3.1. Jeśli w schemacie nadal są zewnętrzne cele `$ref`, najpierw je zbundle'uj albo wbuduj, a potem wygeneruj tutaj końcowy wynik TypeScript.
