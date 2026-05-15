# Czym jest dekoder UUID?

Dekoder UUID wyjaśnia strukturę wewnątrz uniwersalnie unikalnego identyfikatora. Normalizuje typowe wklejane formaty, sprawdza, czy wartość jest 128-bitowym UUID, i pokazuje wersję, wariant, surowe bajty szesnastkowe oraz reprezentacje liczbowe gotowe do skopiowania.

UUID-y często traktuje się jak nieprzejrzyste ciągi, ale półbajt wersji mówi, jak identyfikator został utworzony. UUID-y wersji 4 są losowe, wersje 3 i 5 są skrótami opartymi na nazwie, a wersje uporządkowane według czasu, takie jak 1, 6 i 7, mogą zawierać informacje o znaczniku czasu.

## Kiedy go używać

Użyj tego narzędzia, gdy musisz sprawdzić identyfikator z logów, baz danych, interfejsów API, śladów lub danych testowych. Przydaje się do potwierdzenia, czy UUID jest losowy czy oparty na czasie, przekonwertowania go na format dziesiętny lub Base64 dla innego systemu oraz wykrycia, czy pole węzła UUID v1 lub v6 może ujawniać identyfikator w stylu MAC.

Dekoder działa w przeglądarce i nie wysyła wartości UUID na serwer. Akceptuje kanoniczne UUID-y, wartości `urn:uuid:`, UUID-y w nawiasach klamrowych, zapis wielkimi literami oraz 32-znakowe szesnastkowe UUID-y bez łączników.

## Na co uważać

Pola wersji i wariantu UUID opisują układ bitów, a nie to, czy identyfikator jest w praktyce globalnie unikalny. Poprawnie wyglądający UUID nadal może się zduplikować, jeśli został wygenerowany źle albo omyłkowo skopiowany.

W przypadku UUID-ów wersji 1 i 6 pole węzła może wyglądać jak adres MAC. Nowoczesne generatory mogą zamiast tego ustawić bit multicast i użyć losowego węzła, więc traktuj tę wartość jako identyfikator węzła, chyba że kontrolujesz generator.
