## Czym jest konwersja JWK ↔ PEM?

JWK (JSON Web Key) to materiał klucza w formacie JSON używany przez JOSE/JWT, endpointy JWKS oraz konfiguracje serverless lub przeglądarkowe. Jest łatwy do odczytania przez oprogramowanie, ale rzadziej akceptowany przez CLI i infrastrukturę oczekującą plików kluczy.

PEM opakowuje dane klucza DER etykietami BEGIN/END. Tego formatu zwykle wymagają OpenSSL, narzędzia TLS, bramy API i wiele SDK.

Ten konwerter łączy te formaty lokalnie w przeglądarce. Obsługuje kontenery kluczy RSA, EC (P-256/384/521) i OKP, pozwala wybrać publiczny PEM SPKI lub prywatny PEM PKCS8 przy starcie z JWK, a obsługiwane bloki PEM może zamienić z powrotem na ładny lub kompaktowy JWK JSON.

Używaj wyjścia publicznego, gdy potrzebujesz tylko weryfikacji lub dystrybucji. Konwersje prywatne pokazują materiał klucza prywatnego na ekranie i w pobranych plikach, więc traktuj wynik jak sekret i zamknij kartę po zakończeniu.

- Przenoś klucze między konfiguracją JWKS/JSON a plikami PEM w stylu OpenSSL.
- Wyodrębnij klucz publiczny przed udostępnieniem go weryfikatorom JWT, bramom lub klientom.
- Konwertuj lokalnie bez wysyłania materiału klucza na serwer.
