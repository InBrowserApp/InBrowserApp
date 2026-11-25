## Konwersja binarnego pliku Plist na JSON

Wybierz **Otwórz binarny plik Plist** lub upuść binarny plik `.plist` Apple. Sprawdź sformatowany JSON, skopiuj go lub pobierz jako plik `.json`. Binarne listy właściwości zaczynają się od sygnatury `bplist00`. Występują w pakietach aplikacji Apple, ustawieniach i zarchiwizowanych danych. Przykład pokazuje, jak wartości z listy właściwości są zapisywane w JSON.

## Konwersja JSON na binarną listę właściwości Apple

Wybierz **JSON na Plist**, wklej JSON lub otwórz plik `.json`, a następnie wybierz **Konwertuj na binarny Plist**. Pobierz wynikowy plik `.plist`. Ciągi znaków, wartości logiczne, liczby, tablice i obiekty są zamieniane na odpowiadające im typy listy właściwości. Zastąp `null` inną wartością lub pomiń klucz. Przeglądarka przetwarza pliki i wklejony tekst na Twoim urządzeniu.

## Jak zachować daty, bajty i duże liczby całkowite

JSON nie ma osobnego typu dla dat, danych bajtowych ani identyfikatorów UID w archiwach z kluczami. Konwerter używa znaczników `$plist`, aby konwersja w obie strony zachowała znaczenie tych wartości.

| Wartość Plist                               | Przykład JSON                                          |
| ------------------------------------------- | ------------------------------------------------------ |
| Data w UTC                                  | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bajty w Base64                              | `{"$plist":"data","value":"AQID"}`                     |
| Duża liczba całkowita jako zapis dziesiętny | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID w archiwum z kluczami                   | `{"$plist":"uid","value":42}`                          |

Zachowaj znaczniki przy konwersji z powrotem na Plist. Liczbę spoza zakresu bezpiecznych liczb całkowitych JSON zapisz jako wartość dziesiętną w cudzysłowie i użyj znacznika liczby całkowitej. Słownik o takiej samej strukturze jak znacznik jest opakowywany znacznikiem `dictionary`, aby zachować jego klucze. Konwersja zachowuje strukturę i obsługiwane wartości. Kolejność obiektów Plist, liczba bajtów przeznaczonych na zapis liczb i oryginalne dane binarne mogą się zmienić.

[Struktura i typy list właściwości Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
