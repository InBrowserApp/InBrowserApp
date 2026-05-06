# Czym jest szyfrowanie AES?

AES to symetryczny algorytm szyfrowania, co oznacza, że ten sam sekret służy do szyfrowania i odszyfrowywania danych. To narzędzie działa w całości w przeglądarce i korzysta z Web Crypto API, dlatego tekst jawny, hasła i wybrane pliki nie są przesyłane na serwer.

Domyślnym trybem jest AES-GCM, ponieważ szyfruje i uwierzytelnia wynik. Uwierzytelnianie ma znaczenie: jeśli szyfrogram, sól albo IV zostaną później zmienione, odszyfrowywanie powinno zakończyć się błędem zamiast zwrócić zmienione dane. AES-CBC i AES-CTR są dostępne dla zgodności, ale same nie uwierzytelniają szyfrogramu.

## Kiedy używać tego narzędzia

Użyj go, gdy musisz zabezpieczyć notatkę, token, fragment konfiguracji albo niewielki plik przed zapisaniem lub udostępnieniem innym kanałem. Wynikiem jest koperta JSON zawierająca tryb, ustawienia wyprowadzania klucza, sól, IV i szyfrogram, dzięki czemu te parametry pozostają razem dla odpowiadającego im kroku odszyfrowywania.

Przy szyfrowaniu opartym na haśle hasło jest przetwarzane przez PBKDF2 z losową solą. Zwiększ liczbę iteracji, gdy możesz zaakceptować wolniejsze szyfrowanie i odszyfrowywanie. Przy szyfrowaniu surowym kluczem wklej klucz szesnastkowy o dokładnie wybranej długości: 32 znaki hex dla 128 bitów, 48 dla 192 bitów albo 64 dla 256 bitów.

## Uwagi praktyczne

Przechowuj hasło lub surowy klucz oddzielnie od zaszyfrowanego JSON. Każda osoba mająca zarówno JSON, jak i materiał klucza może odszyfrować dane. Jeśli szyfrujesz plik, pobierz wynik JSON i zachowaj oryginalną nazwę pliku osobno, jeśli ten kontekst jest ważny.

Nie używaj ponownie ręcznie podanego IV z tym samym kluczem. To narzędzie generuje świeży IV i sól przy każdym uruchomieniu, co jest bezpieczniejszym ustawieniem domyślnym. Preferuj AES-GCM, chyba że inny system konkretnie wymaga AES-CBC albo AES-CTR.
