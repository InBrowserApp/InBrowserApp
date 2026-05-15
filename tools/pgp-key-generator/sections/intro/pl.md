# Generator kluczy PGP

Użyj tego narzędzia, aby utworzyć parę kluczy OpenPGP bezpośrednio w przeglądarce. Generuje ono klucz publiczny w formacie ASCII armor, klucz prywatny, certyfikat odwołania, ID klucza i odcisk palca, dzięki czemu możesz skonfigurować szyfrowaną pocztę, szyfrowanie plików, podpisywanie wydań lub procesy odzyskiwania konta bez wysyłania materiału klucza na serwer.

## Kiedy go używać

Klucze PGP są przydatne, gdy potrzebujesz kryptografii asymetrycznej: inne osoby używają Twojego klucza publicznego do szyfrowania danych dla Ciebie lub weryfikowania podpisów, a Twój klucz prywatny odszyfrowuje dane i tworzy podpisy. Generator działający w przeglądarce jest wygodny przy krótkich sesjach konfiguracji, demonstracjach lub lokalnych przepływach pracy, w których chcesz od razu uzyskać wynik.

## Jak wygenerować parę kluczy

Wpisz imię i nazwisko, e-mail albo oba te elementy, aby klucz miał rozpoznawalny ID użytkownika. Dodaj opcjonalny komentarz, jeśli chcesz rozdzielić klucze do pracy, projektu lub podpisywania wydań. Wybierz ECC dla nowoczesnego oprogramowania OpenPGP albo RSA, gdy potrzebujesz zgodności ze starszymi narzędziami. Fraza hasła jest opcjonalna, ale zdecydowanie zalecana dla każdego klucza prywatnego, który zamierzasz zachować.

## Typy kluczy i wygasanie

ECC używa Curve25519 i jest ustawieniem domyślnym, ponieważ jest kompaktowe i szybkie. RSA jest dostępne w wariantach 2048, 3072 i 4096 bitów ze względu na zgodność. Wygaśnięcie jest ustawiane w dniach; używaj 0 tylko dla kluczy, którymi aktywnie zarządzasz i które możesz odwołać. Krótsze okresy ważności zmniejszają długoterminowe ryzyko i ułatwiają nawyk rotacji.

## Bezpieczna obsługa kluczy prywatnych

Pobierz klucz publiczny, klucz prywatny i certyfikat odwołania jako oddzielne pliki. Utwórz kopię zapasową klucza prywatnego w szyfrowanym menedżerze haseł lub bezpiecznym magazynie offline, a certyfikat odwołania przechowuj w osobnym miejscu, aby móc wycofać klucz, jeśli klucz prywatny zostanie utracony lub ujawniony. Przed opublikowaniem klucza publicznego porównaj odcisk palca przez zaufany kanał.
