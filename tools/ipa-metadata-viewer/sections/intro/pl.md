## Otwórz plik IPA i odczytaj metadane głównej aplikacji

Upuść plik `.ipa` z iOS lub wybierz **Otwórz plik IPA**. Przeglądarka odczytuje listę właściwości głównej aplikacji ze ścieżki takiej jak `Payload/Trail Notes.app/Info.plist`. Wypróbuj przykładowy plik IPA, aby zobaczyć dostępne pola przed otwarciem własnego pliku. Rozpakowanie archiwum i odczyt listy właściwości odbywają się w przeglądarce.

## Co oznaczają identyfikator pakietu, wersja i platformy?

Identyfikator w `CFBundleIdentifier` określa pakiet aplikacji. Wersja w `CFBundleShortVersionString` to wersja wydania, a `CFBundleVersion` identyfikuje kompilację. Pola `MinimumOSVersion` i `CFBundleSupportedPlatforms` pozwalają sprawdzić minimalną wersję systemu oraz nazwy platform zapisane w pakiecie. Wyświetlana nazwa pochodzi z klucza `CFBundleDisplayName` lub `CFBundleName`.

## Sprawdź i wyeksportuj Info.plist

Wybierz **Info.plist**, aby zobaczyć całą listę właściwości w czytelnej postaci XML, wraz z kluczami, których nie wyświetla przegląd. Przeglądarka odczytuje listy właściwości zarówno w formacie binarnym, jak i XML. Wybierz **Kopiuj XML**, aby użyć czytelnej postaci w innym narzędziu, lub **Pobierz Info.plist**, aby zapisać oryginalne bajty. Ścieżka w archiwum wskazuje pakiet aplikacji, z którego pochodzą metadane.

[Dokumentacja listy właściwości Info.plist firmy Apple](https://developer.apple.com/documentation/bundleresources/information-property-list)
