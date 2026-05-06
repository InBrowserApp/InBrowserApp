## Dlaczego to narzędzie jest przydatne

Większość stron nie potrzebuje rozbudowanego systemu sitemap. Wyszukiwarki potrzebują poprawnego dokumentu XML ze stabilnymi URL-ami, rozsądnymi wskazówkami aktualizacji i bez przypadkowych błędów formatowania. To narzędzie skupia się właśnie na tym zadaniu.

## Co obejmuje

- Tworzenie standardowej mapy `urlset` dla stron jednego serwisu.
- Tworzenie dokumentu `sitemapindex`, gdy duża strona jest już podzielona na wiele plików sitemap.
- Pracę z bezwzględnymi URL-ami albo czystymi ścieżkami względnymi łączonymi z jednym bazowym URL.

## Na co uważać

- Lokalizacje w sitemap powinny prowadzić do końcowych URL-i kanonicznych, nie do tymczasowych przekierowań.
- `lastmod`, `changefreq` i `priority` to wskazówki, a nie gwarancje zachowania crawlerów.
- Jeśli każdy wiersz jest już pełnym URL-em, wyłącz automatyczne łączenie z bazowym URL i zachowaj jawny XML.
