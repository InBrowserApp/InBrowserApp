## Jak otworzyć plik CAR z IPFS lub Filecoin online

Wybierz plik `.car` z urządzenia. Narzędzie odczyta archiwum lokalnie i wyświetli jego główny CID. Jeśli archiwum zawiera kilka głównych identyfikatorów CID, wybierz ten, którego potrzebujesz. IPFS i Filecoin używają archiwów CAR (Content Addressable aRchives), w których adresy wynikają z zawartości. Katalogi zasobów Apple używają innego formatu z tym samym rozszerzeniem.

## Jak wyodrębnić pliki lub zapisać folder z CAR jako ZIP

Otwórz folder, aby zobaczyć jego zawartość. Wybierz plik i kliknij **Pobierz plik**, aby zapisać jego oryginalne dane. Aby zapisać folder wraz z podfolderami, wybierz **Pobierz ZIP**. Archiwum ZIP zachowuje strukturę folderów UnixFS.

## Co oznacza brak bloku?

Archiwum CAR przechowuje zawartość w blokach oznaczonych identyfikatorami CID. Element główny może odsyłać do bloków spoza niepełnego archiwum. Jeśli brakuje bloku potrzebnego do odczytania elementu, uzyskaj kompletne archiwum ze źródła lub pobierz element, którego wszystkie bloki są dostępne. Pliki CAR mogą również przechowywać dane w innych formatach IPLD. To narzędzie wyodrębnia pliki i foldery UnixFS. [Specyfikacja formatu IPLD CAR](https://ipld.io/specs/transport/car/)
