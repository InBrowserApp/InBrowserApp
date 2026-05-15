Kolekcja narzędzi hashujących łączy przeniesione narzędzia do haszowania, aby można było wybrać właściwy algorytm przed otwarciem konkretnego narzędzia. Obejmuje codzienne skróty plików, kontrole zgodności ze starszymi systemami, uwierzytelnianie wiadomości z kluczem, ciągi Subresource Integrity, haszowanie haseł, weryfikację haseł oraz szybkie niekryptograficzne sumy kontrolne.

## Kiedy używać tych narzędzi

Używaj narzędzi do skrótów kryptograficznych, gdy potrzebujesz powtarzalnego odcisku dla tekstu lub pliku, na przykład do porównania pobranego archiwum z opublikowaną sumą kontrolną SHA-256. Używaj HMAC, gdy wynik ma potwierdzać, że ktoś posiadający wspólny sekret utworzył lub zatwierdził wiadomość. Używaj Argon2, bcrypt, PBKDF2 lub scrypt w przepływach związanych z hasłami i wyprowadzaniem kluczy, gdzie konfigurowalny koszt jest ważniejszy niż sama szybkość.

## Bezpieczny wybór

Nie każdy hash nadaje się do zastosowań związanych z bezpieczeństwem. MD4, MD5 i SHA-1 są przydatne dla starszych systemów i kontroli zgodności, ale nie należy ich używać w nowych projektach integralności wrażliwych na bezpieczeństwo. CRC, Adler-32, MurmurHash, CityHash i xxHash to szybkie sumy kontrolne albo hashe do kubełkowania, a nie podpisy odporne na manipulację. Gdy nie masz pewności, wybierz SHA-256 dla publicznych sum kontrolnych, HMAC-SHA-256 do weryfikacji z kluczem oraz Argon2id lub bcrypt do przechowywania haseł.

## Prywatność i przepływ pracy

Poszczególne narzędzia w tej kolekcji działają w przeglądarce. Tekst i pliki są przetwarzane lokalnie przez wybrane narzędzie, chyba że dane narzędzie wyraźnie dokumentuje publiczne zachowanie wyszukiwania, którego narzędzia hashujące nie potrzebują. W przypadku materiałów wrażliwych wyczyść wygenerowane wartości po użyciu i unikaj wklejania sekretów do udostępnionych lub nagrywanych sesji przeglądarki.
