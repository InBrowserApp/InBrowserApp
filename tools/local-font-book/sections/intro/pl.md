## Czym jest Local Font Access?

Local Font Access to API przeglądarki listujące fonty zainstalowane na urządzeniu.

To narzędzie pozwala przeszukiwać wyniki, porównywać powiązane odmiany i kopiować fragment CSS dla wybranego fontu.

Działa tylko w bezpiecznych kontekstach i obsługiwanych przeglądarkach oraz wymaga zgody użytkownika (local-fonts).

API zwraca FontData z polami family, fullName, postscriptName i style.

### Najważniejsze punkty

- Użyj go, aby potwierdzić dokładne nazwy potrzebne w stosie CSS `font-family` na bieżącym urządzeniu.
- Wywołania muszą być inicjowane przez użytkownika.
- Permissions Policy może blokować dostęp na niektórych stronach.
- To narzędzie działa lokalnie i nie wysyła fontów.
