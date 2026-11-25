## Generowanie kodów pocztowych do testów

Wybierz kraj lub region, wpisz liczbę kodów i wybierz **Generuj**. Możesz skopiować całą listę lub pobrać plik tekstowy w kodowaniu UTF-8 z jednym kodem pocztowym w każdym wierszu. Użyj wyników do wypełniania formularzy testowych, uzupełnienia bazy przykładowymi danymi lub sprawdzenia, jak formularze zamówienia i rejestracji wyświetlają lokalne kody pocztowe.

## Porównanie formatów kodów pocztowych

Kody pocztowe mogą zawierać litery, spacje, łączniki i zera na początku. Przykładowy amerykański kod ZIP to `02108`. W formacie ZIP+4 dochodzi łącznik i cztery cyfry, jak w `02108-1234`. Przykładowe kody to `SW1 2AB` w Wielkiej Brytanii, `K1A 0B1` w Kanadzie, `100-0001` w Japonii i `01001-000` w Brazylii, gdzie kod określa się skrótem CEP. Wybrany kraj lub region określa format wyniku niezależnie od języka strony.

Przy imporcie do arkusza kalkulacyjnego lub bazy danych przechowuj kody pocztowe jako tekst. Zaimportowanie `02108` jako liczby usuwa początkowe zero i zmienia wartość.

## Czy mogę użyć tych kodów do wysyłki?

Faker.js tworzy przykładowe kody w wybranym formacie. Wygenerowany kod może się pokrywać z kodem rzeczywistego obszaru doręczeń. Przed nadaniem przesyłki sprawdź kod właściwy dla adresu u odpowiedniego operatora pocztowego.
