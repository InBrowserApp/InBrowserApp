## Jak usunąć dane wrażliwe z pliku HAR?

Plik HAR (HTTP Archive) zawiera żądania i odpowiedzi sieciowe zarejestrowane przez przeglądarkę. Może zawierać sesyjne pliki cookie, tokeny autoryzacji, adresy URL i treści z danymi poufnymi. Utwórz oczyszczoną kopię do zgłoszenia serwisowego, raportu o błędzie lub udostępnienia współpracownikowi. Metoda, kod stanu i czasy każdego żądania pozostają w pliku.

1. Otwórz narzędzia deweloperskie przeglądarki i przejdź do panelu **Sieć**. Odtwórz problem, a następnie wyeksportuj dziennik do pliku HAR. W Chrome wybierz **Export HAR (sanitized)**, aby uzyskać kopię z usuniętymi standardowymi nagłówkami uwierzytelniania.
2. Otwórz tutaj wyeksportowany plik HAR lub przeciągnij go na stronę. Narzędzie przygotuje kopię od razu po wybraniu pliku. Wypróbuj przykład, aby zobaczyć, jak zmieni się przykładowy zapis.
3. Sprawdź liczniki i wybierz **Pobierz oczyszczony plik HAR**. Nowy plik ma końcówkę `.sanitized.har` i można go zaimportować do narzędzi deweloperskich lub otworzyć w narzędziu [Analizator ruchu sieciowego HAR](/pl/tools/har-analyzer/). Przetwarzanie odbywa się w Twojej przeglądarce.

## Co jest usuwane lub maskowane?

Narzędzie usuwa pliki cookie i typowe nagłówki uwierzytelniania, w tym `Authorization` i `X-API-Key`. Domyślnie maskuje też wartości parametrów URL oraz usuwa treść żądań, odpowiedzi i zarejestrowanych wiadomości WebSocket. Na przykład `?token=example&page=2` zmienia się w wyeksportowanym pliku na `?token=REDACTED&page=REDACTED`. Nazwy parametrów pozostają dostępne do debugowania. Każde zmienione pole liczy się osobno, również gdy ta sama wartość występuje w kilku polach.

Wyłącz odpowiednią opcję, jeśli do odtworzenia problemu potrzebujesz oryginalnych wartości parametrów lub treści wiadomości. Nazwy hostów, ścieżki adresów URL, pozostałe nagłówki i metadane specyficzne dla przeglądarki nadal mogą zawierać dane poufne. Przejrzyj te pola przed udostępnieniem pliku.
