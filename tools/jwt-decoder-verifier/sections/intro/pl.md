## Czym jest dekoder i weryfikator JWT?

JSON Web Token to kompaktowy ciąg z trzema segmentami base64url: nagłówkiem, treścią i podpisem. To narzędzie dekoduje nagłówek i treść w przeglądarce, dzięki czemu możesz sprawdzić strukturę tokenu bez wysyłania go na serwer.

Weryfikacja podpisu sprawdza, czy token został podpisany kluczem i algorytmem, których oczekujesz. Użyj współdzielonego sekretu dla tokenów HS256, HS384 lub HS512. Użyj klucza publicznego PEM, JWK lub JWKS dla tokenów RS, PS i ES.

## Kiedy go używać

Użyj dekodera podczas debugowania przepływów uwierzytelniania, sprawdzania roszczeń OAuth lub OpenID Connect, porównywania środowisk albo potwierdzania, że backend wystawia oczekiwane wartości odbiorcy, wystawcy, podmiotu, wygaśnięcia i identyfikatora klucza.

Użyj weryfikacji, gdy masz pasujący sekret lub klucz publiczny i musisz potwierdzić, że nagłówek, treść i podpis nadal należą do siebie. Narzędzie wyróżnia też `exp`, `nbf` i `iat`, aby typowe problemy z zegarem i wygaśnięciem były od razu widoczne.

## Uwagi dotyczące bezpieczeństwa

Treści JWT są tylko kodowane, a nie szyfrowane. Każdy, kto ma token, może odczytać jego roszczenia, chyba że token jest osobnym zaszyfrowanym JWE, którego to narzędzie nie przetwarza.

Nie wklejaj tokenów produkcyjnych ani prywatnych sekretów na współdzielonych komputerach. Narzędzie działa lokalnie w przeglądarce i nie przechowuje tokenu ani materiału weryfikacyjnego, ale najbezpieczniejszy przepływ pracy nadal polega na używaniu krótkotrwałych tokenów testowych i kluczy publicznych zawsze, gdy to możliwe.
