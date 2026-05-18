## Czym jest UUID v3?

UUID v3 to format UUID oparty na nazwie. Przyjmuje UUID przestrzeni nazw oraz
nazwę, haszuje je za pomocą MD5 i formatuje wynik jako standardowy UUID.
Najważniejszą cechą jest deterministyczność: ta sama przestrzeń nazw i nazwa
zawsze dają ten sam UUID.

To narzędzie działa w całości w przeglądarce. Przestrzeń nazw, nazwa i
wygenerowany UUID pozostają na Twoim urządzeniu, chyba że skopiujesz wynik w
inne miejsce.

## Kiedy go używać

- Używaj UUID v3, gdy potrzebujesz stabilnego identyfikatora dla znanej nazwy,
  takiej jak nazwa DNS, URL, ścieżka obiektu albo nazwa użytkownika.
- Wybierz przestrzeń nazw pasującą do rodzaju identyfikowanej nazwy. DNS i URL
  to najczęściej używane ustawienia.
- Konsekwentnie używaj tej samej przestrzeni nazw. Zmiana przestrzeni nazw
  zmienia każdy wygenerowany UUID, nawet gdy nazwa pozostaje taka sama.
- Preferuj UUID v5 albo inny nowoczesny identyfikator, gdy masz wybór i
  potrzebujesz UUID opartego na nazwie z silniejszym haszem. UUID v3 istnieje
  dla zgodności z systemami, które konkretnie oczekują UUID opartych na MD5.

## Uwagi o bezpieczeństwie

UUID v3 nie jest losowym identyfikatorem i nie jest tajny. Każdy, kto zna
przestrzeń nazw i nazwę, może odtworzyć ten sam UUID. Nie używaj go do haseł,
tokenów sesji, kluczy API ani innych wartości, które muszą być niemożliwe do
przewidzenia.
