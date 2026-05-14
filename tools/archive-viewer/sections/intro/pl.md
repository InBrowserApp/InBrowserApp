Przeglądarka archiwów pozwala sprawdzić skompresowany plik przed jego
rozpakowaniem. To narzędzie otwiera pliki ZIP, TAR, GZ, TGZ i TAR.GZ
bezpośrednio w przeglądarce, dzięki czemu możesz potwierdzić, co jest w środku,
przeglądać foldery, podglądać czytelne pliki i pobrać tylko potrzebny wpis.

## Kiedy używać

Użyj jej, gdy otrzymasz skompresowany pakiet i chcesz szybko zajrzeć do środka
bez rozpakowywania całego archiwum. Przydaje się do sprawdzania paczek wydań,
pobranych szablonów, pakietów logów, migawek kodu źródłowego lub pojedynczego
załącznika `.gz`.

## Prywatność i obsługa plików

Zawartość archiwum jest odczytywana lokalnie w sesji przeglądarki. Plik nie jest
przesyłany do InBrowser.App. Duże wpisy tekstowe są ograniczane w podglądzie, aby
strona działała płynnie; pobierz wpis, gdy musisz sprawdzić kompletny plik.

## Obsługiwane formaty archiwów

Przeglądarka obsługuje standardowe archiwa ZIP, nieskompresowane pliki TAR,
pojedyncze pliki skompresowane GZIP oraz archiwa TAR spakowane GZIP (`.tgz` lub
`.tar.gz`). Archiwa chronione hasłem lub szyfrowane nie są obsługiwane w tym
pierwszym etapie przepisywania.

## Działanie podglądu

Pliki tekstowe, takie jak JSON, Markdown, logi, kod źródłowy, CSV, XML, YAML i
TOML, można podglądać z podświetlaniem składni, gdy dostępny jest pasujący
język. Popularne pliki obrazów można podejrzeć wizualnie. Pozostałe pliki
binarne można nadal pobrać, ale narzędzie nie będzie próbowało ich renderować.
