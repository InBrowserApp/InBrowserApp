## Omówienie

JSON Diff Path porównuje dwa dokumenty JSON i zamienia każdą zmianę strukturalną na czytelny rekord ścieżki z wyjściem zarówno JSONPath, jak i JSON Pointer.

## Kiedy używać

Użyj tego, gdy chcesz przejrzeć zmiany w ładunkach API, sprawdzić migracje konfiguracji albo wygenerować operacje RFC 6902 JSON Patch do automatyzacji.

## Jak to działa

Narzędzie parsuje oba wejścia JSON, oblicza zmiany `add`, `remove` i `replace`, a następnie pozwala filtrować te operacje i przełączać się między listą ścieżek a wyjściem JSON Patch w tym samym panelu wyników.
