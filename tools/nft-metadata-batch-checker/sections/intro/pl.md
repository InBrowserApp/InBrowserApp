## Jak zweryfikować metadane JSON przed utworzeniem NFT

Wybierz **Pliki lokalne**, aby sprawdzić pojedyncze pliki JSON albo folder całej kolekcji na urządzeniu. Pliki o nazwach liczbowych, takich jak `1` lub `42`, możesz wybrać bezpośrednio. Narzędzie wykrywa błędy JSON i typowe problemy z metadanymi każdego tokena, w tym puste nazwy, brakujące obrazy, nieprawidłowe opisy i źle zapisane atrybuty. Wybierz **Do sprawdzenia**, aby zobaczyć pozycje wymagające poprawek, lub pobierz pełny raport w formacie JSON.

## Jak sprawdzić wiele URI tokenów naraz

W zakładce **URI tokenów** wklej adresy metadanych, po jednym w wierszu. W przypadku numerowanych kolekcji wybierz **Wzorzec URI** i użyj symbolu zastępczego, jak w `https://example.com/metadata/{id}.json`. Podaj pierwszy i ostatni ID, aby sprawdzić zakres łącznie z jego granicami. W formacie dziesiętnym identyfikator jest wstawiany w zapisanej postaci. Format **Szesnastkowy ERC-1155** zapisuje każdy ID 64 małymi znakami szesnastkowymi z zerami wiodącymi, zgodnie z regułą podstawiania `{id}` w ERC-1155. Narzędzie podstawia też ID w miejsce `{id}` w wartościach metadanych, na przykład w linkach do obrazów.

## Jak sprawdzić linki do obrazów i animacji NFT

Włącz **Sprawdzaj dostępność multimediów**, aby zweryfikować linki w polach `image` i `animation_url`. Wybierz cały folder na urządzeniu, aby sprawdzić multimedia wskazane ścieżkami względnymi. Ścieżka zaczynająca się od `/` jest rozpatrywana względem katalogu głównego wybranego folderu. Przeglądarka może też sprawdzać zasoby HTTP, IPFS i Arweave. Błąd bramy, przekroczenie czasu oczekiwania lub ograniczenie żądań między domenami mogą uniemożliwić potwierdzenie działania linku. Sprawdź takie linki w używanej bramie lub na platformie handlowej. Pliki lokalne są sprawdzane w przeglądarce. Sprawdzanie URI wymaga połączenia z odpowiednim hostem lub bramą.

Definicje pól i zasady podstawiania wartości w URI tokenów znajdziesz w [przewodniku OpenSea po metadanych](https://docs.opensea.io/docs/metadata-standards) oraz [specyfikacji metadanych ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
