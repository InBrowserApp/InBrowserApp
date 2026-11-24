## Konwersja JSON na arkusz programu Excel

Wklej tablicę JSON lub otwórz lokalny plik `.json`, sprawdź podgląd arkusza i kliknij **Pobierz XLSX**. Konwerter tworzy jeden arkusz z wierszem nagłówków. Każdy obiekt staje się wierszem, a każde pole występujące w tablicy dostaje własną kolumnę. Przydaje się to do pracy z rekordami z API, listami produktów i eksportami danych. Jeśli odpowiedź API zawiera rekordy w polu takim jak `data`, wklej tablicę z tego pola.

## Rozwijanie zagnieżdżonych pól JSON na kolumny

Opcja **Rozwiń zagnieżdżone pola** jest domyślnie włączona. Dwa poniższe rekordy dają kolumny `name`, `contact.city` oraz `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Po wyłączeniu tej opcji `contact` pozostanie w jednej kolumnie jako tekst JSON, na przykład `{"city":"Oslo"}`. W obu trybach każda tablica pozostaje w jednej komórce, więc `tags` nie tworzy dodatkowych wierszy. Brakujące pola i pola o wartości `null` pojawią się jako puste komórki.

## Jak Excel zapisuje wartości JSON

Liczby i wartości logiczne zachowują zwykle swoje typy w programie Excel. Liczby wykraczające poza jego precyzję lub zakres są zapisywane jako tekst, aby zachować wszystkie cyfry. Excel zapisuje ciągi znaków JSON jako tekst, więc identyfikatory takie jak `"00123"`, daty zapisane jako ciągi znaków i tekst zaczynający się od `=` zachowują oryginalne znaki.

## Podgląd i pobieranie w przeglądarce

Podgląd pokazuje początek arkusza. Pobrany plik XLSX zawiera wszystkie rekordy i kolumny. Konwersja odbywa się w przeglądarce, a dane JSON pozostają na twoim urządzeniu. Aby wyeksportować dane do pliku tekstowego, użyj [konwertera JSON na CSV](../json-to-csv-converter/).
