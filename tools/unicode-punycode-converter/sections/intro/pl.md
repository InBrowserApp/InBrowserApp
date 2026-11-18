## Konwersja domen między Unicode a Punycode

Wklej domenę, np. `bücher.com`, w polu **Domena Unicode**, aby otrzymać `xn--bcher-kva.com` w polu **Domena ASCII**. Aby odczytać nazwę w Unicode, wklej domenę z prefiksem `xn--` w polu **Domena ASCII**. Oba pola aktualizują się podczas wpisywania. Możesz skopiować dowolną wersję.

## Kiedy używać każdej wersji

Punycode zapisuje znaki spoza ASCII w międzynarodowych nazwach domen (IDN) za pomocą liter i cyfr ASCII oraz łączników. Zakodowana część nazwy zaczyna się od `xn--`, a części zapisane w ASCII, takie jak `com`, pozostają bez zmian. Użyj wersji ASCII, gdy wymaga jej konfiguracja DNS lub hostingu. Wersja Unicode ułatwia odczytanie nazwy domeny z dziennika lub pliku konfiguracyjnego.

## Co wkleić do konwertera

Wpisz samą nazwę hosta. Z adresu `https://bücher.com/catalog` wklej tylko `bücher.com`. Narzędzie obsługuje też subdomeny, więc `www.bücher.com` zmieni się na `www.xn--bcher-kva.com`.
