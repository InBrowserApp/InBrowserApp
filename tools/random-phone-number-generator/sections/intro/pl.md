## Jak wygenerować listę przykładowych numerów telefonu

Wybierz kraj lub region i format numeru, podaj liczbę numerów i kliknij **Generuj**. Skopiuj wyniki do formularza lub pobierz plik tekstowy UTF-8 z jednym numerem w każdym wierszu. Użyj numerów, aby sprawdzić maski wprowadzania danych w formularzach, uzupełnić listę przykładowych kontaktów lub przetestować, jak aplikacja zapisuje i wyświetla numery telefonu.

## Format krajowy i międzynarodowy

**Krajowy** korzysta z formatu dostępnego w Faker.js dla wybranego kraju. Numer ze Stanów Zjednoczonych może wyglądać jak `(202) 555-0100`, a numer z Wielkiej Brytanii jak `07700 900123`. **Międzynarodowy (E.164)** zapisuje znak plus, numer kierunkowy kraju i pozostałe cyfry bez spacji, jak w `+12025550100` lub `+447700900123`.

## Jak zachować znak plus i zera wiodące

Przechowuj numery telefonu w arkuszach kalkulacyjnych i bazach danych jako tekst. Jeśli arkusz zaimportuje `07700 900123` lub `+447700900123` jako liczbę, może usunąć początkowe zero lub znak plus. Te przykładowe numery służą do sprawdzania formatu. Do testowania połączeń lub SMS-ów używaj numeru testowego, do którego masz dostęp.
