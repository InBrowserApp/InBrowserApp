## Czym jest para kluczy SSH?

Para kluczy SSH to klucz publiczny i klucz prywatny używane do uwierzytelniania na serwerach, u dostawców Git, w systemach wdrożeniowych i innych usługach opartych na SSH. Klucz publiczny można udostępniać. Klucz prywatny musi pozostać tajny.

Ten generator tworzy klucze Ed25519 lub RSA w formacie OpenSSH w całości w przeglądarce. Pokazuje również odcisk SHA-256, czyli zwartą wartość, którą OpenSSH zwykle wyświetla podczas weryfikowania klucza.

## Kiedy używać tego narzędzia

- Utwórz klucz deweloperski dla serwera testowego, zdalnego repozytorium Git, kontenera lub tymczasowego środowiska laboratoryjnego.
- Wygeneruj klucz Ed25519, gdy potrzebujesz nowoczesnego, kompaktowego domyślnego wyboru dla nowego dostępu SSH.
- Wygeneruj klucz RSA, gdy starsza usługa nie obsługuje Ed25519.
- Skopiuj klucz publiczny do `authorized_keys`, pozostawiając klucz prywatny na swoim urządzeniu.

## Jak wybrać algorytm

Ed25519 jest najlepszym domyślnym wyborem dla większości nowych kluczy SSH, ponieważ jest mały, szybki i szeroko obsługiwany przez bieżące wersje OpenSSH. RSA jest przydatny dla zgodności ze starszymi urządzeniami, starszymi serwerami Git lub wymaganiami zasad, które nadal oczekują kluczy RSA.

W przypadku RSA 4096 bitów to zachowawcza wartość domyślna. Mniejsze klucze 2048-bitowe są szybsze i nadal powszechne, ale wiele zespołów preferuje dziś 3072 lub 4096 bitów dla nowych kluczy długoterminowych.

## O czym pamiętać

- Tworzony tutaj klucz prywatny jest niezaszyfrowany. Dodaj hasło poleceniem `ssh-keygen -p -f <key-file>`, jeśli go potrzebujesz.
- Przechowuj klucz prywatny z restrykcyjnymi uprawnieniami, np. `chmod 600 <key-file>`.
- Nie wklejaj kluczy prywatnych do zgłoszeń, czatów, dzienników ani nieznanych stron internetowych.
- Wymieniaj klucze, gdy laptop, sekret CI lub kopia zapasowa zawierające klucz prywatny mogły zostać ujawnione.
