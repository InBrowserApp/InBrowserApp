## Jak połączyć urządzenie HID w przeglądarce

Podłącz obsługiwane urządzenie interfejsu użytkownika, takie jak kontroler gier, joystick, pedał lub klawiatura makr. Wybierz **Połącz z urządzeniem**, a następnie wybierz urządzenie w oknie WebHID. Przeglądarka raportów pokazuje identyfikator dostawcy (VID) i identyfikator produktu (PID), które pomagają rozpoznać sprzęt. Użyj zgodnej przeglądarki komputerowej przez HTTPS.

## Jak odczytywać kolekcje HID i identyfikatory raportów

Otwórz kolekcję, aby zobaczyć jej stronę użycia, użycie i identyfikatory raportów. Strona użycia grupuje powiązane funkcje, a użycie wskazuje funkcję w tej grupie. Raporty wejściowe zawierają dane z urządzenia, raporty wyjściowe opisują dane, które może wysłać komputer hosta, a raporty funkcji opisują ustawienia lub stan urządzenia. Identyfikator raportu 0 oznacza, że interfejs nie używa jawnego identyfikatora raportu.

## Jak analizować zmieniające się bajty wejściowe

Poruszaj jednym elementem sterującym naraz, obserwując raporty na żywo w formacie szesnastkowym. Wyróżnione bajty różnią się od poprzednich danych o tym samym identyfikatorze raportu. Identyfikator raportu jest wyświetlany oddzielnie od danych. Wstrzymaj przechwytywanie, aby przeanalizować ostatnie raporty, lub wyczyść listę i zacznij od nowa. Sprawdź format raportów urządzenia, aby zinterpretować przyciski, osie i inne pola.

## Dlaczego urządzenie lub kolekcja nie jest widoczna?

Sprawdź, czy system operacyjny rozpoznaje urządzenie, a następnie ponownie otwórz okno wyboru. Przeglądarki chronią typowe kolekcje klawiatur i myszy, a niektóre urządzenia udostępniają stronom internetowym tylko część swoich raportów. Ta przeglądarka raportów odbiera raporty wejściowe z wybranego urządzenia i przechowuje dane w tej karcie. W przypadku standardowych elementów sterujących wypróbuj [Tester pada](../gamepad-tester/) lub [Tester klawiatury](../keyboard-tester/).
