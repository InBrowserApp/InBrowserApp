## Konwertowanie konfiguracji środowiska

Wklej plik `.env` i wybierz JSON lub YAML albo przekonwertuj płaski obiekt JSON/YAML z powrotem na `.env`. Importuj pliki lokalne, zamieniaj wejście z wyjściem oraz kopiuj lub pobieraj wynik. Wszystko działa w przeglądarce; konfiguracja nigdy nie jest przesyłana ani zapisywana w historii przeglądarki lub pamięci lokalnej.

### Wartości i cudzysłowy

Zmienne środowiskowe są ciągami znaków: `PORT=3000`, `DEBUG=false` i `CODE=0012` pozostają odpowiednio `"3000"`, `"false"` i `"0012"`. Liczby i wartości logiczne w JSON/YAML są konwertowane na ciągi znaków. Null, tablice i zagnieżdżone obiekty wymagają jawnej wartości tekstowej. Ujmuj wartości YAML takie jak `0012` w cudzysłowy, jeśli ich dokładny zapis ma znaczenie.

Parser obsługuje puste wiersze, komentarze `#`, prefiks `export` oraz cudzysłowy pojedyncze, podwójne i odwrócone, także dla wartości wielowierszowych. Interpretowane są tylko sekwencje `\n` i `\r` w podwójnych cudzysłowach. Pozostałe cudzysłowy i ukośniki odwrotne pozostają dosłowne, zgodnie z typowym zachowaniem dotenv. Klucze mogą zawierać litery, cyfry i podkreślenia, ale nie mogą zaczynać się od cyfry. Przy generowaniu wyniku wybierany jest rodzaj cudzysłowu, który zachowuje wartość.

### Sprawdzanie konfiguracji

Powtórzone klucze `.env` wyświetlają numery wierszy; używana jest ostatnia definicja. Brak zamykających cudzysłowów, tekst po zamykających cudzysłowach i nieprawidłowe przypisania powodują błędy z odnośnikami do odpowiedniego wiersza. Cudzysłowy typograficzne powodują ostrzeżenie. Powtórzone klucze JSON/YAML są błędami.

Komentarze, oryginalny rodzaj cudzysłowów i formatowanie nie są zachowywane. Odwołania takie jak `${NAME}` i polecenia powłoki pozostają dosłowne i nigdy nie są wykonywane. Różne narzędzia wczytujące `.env` stosują różne reguły; to narzędzie obsługuje udokumentowany podzbiór zamiast interpretować skrypty powłoki.

Zobacz [specyfikację .env w Node.js](https://nodejs.org/api/environment_variables.html#dotenv) i [reguły parsowania dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
