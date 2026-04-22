## Czym jest konwersja JWK ↔ PEM?

JWK (JSON Web Key) to format JSON dla kluczy kryptograficznych używany w systemach JOSE/JWT. Może reprezentować klucze RSA, EC lub OKP i może występować w JWK Set (JWKS).

PEM to klucz ASN.1/DER zakodowany w Base64 z nagłówkami takimi jak BEGIN PUBLIC KEY lub BEGIN PRIVATE KEY, powszechny w TLS, OpenSSL i wielu SDK.

Narzędzie konwertuje klucze w obu kierunkach, zachowując materiał klucza przy wyborze wyjścia publicznego (SPKI) lub prywatnego (PKCS8). Obsługuje RSA, EC (P-256/384/521) i OKP (Ed25519/X25519/Ed448/X448), a wszystko działa lokalnie w przeglądarce.

Wybierz JWK → PEM, gdy biblioteka, brama lub CLI oczekuje plików kluczy w stylu OpenSSL. Wybierz PEM → JWK, gdy musisz umieścić klucz w JWKS, przekazać go przez konfigurację opartą na JSON albo użyć go w przeglądarce lub środowisku serverless. Konwersja klucza prywatnego zachowuje materiał prywatny, więc udostępniaj tylko wynik publiczny, jeśli to wystarcza.

- Użyj klucza JWK/JWKS w systemach, które akceptują tylko PEM.
- Eksportuj klucze PEM dla bibliotek JWT, bramek API lub dystrybucji kluczy.
- Udostępniaj klucze publiczne bezpiecznie, nie ujawniając danych klucza prywatnego.
