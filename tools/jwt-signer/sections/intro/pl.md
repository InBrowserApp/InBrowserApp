## Czym jest narzędzie do podpisywania JWT?

Narzędzie do podpisywania JWT tworzy kompaktowy JSON Web Token przez serializację nagłówka i payloadu, a następnie podpisanie ich sekretem lub kluczem prywatnym. Wynikiem jest trzyczęściowy token `header.payload.signature` używany przez wiele systemów API, OAuth i sesji.

## Kiedy używać tego narzędzia

- Twórz lokalne tokeny testowe do pracy nad API, środowisk stagingowych i demo.
- Porównuj, jak różne algorytmy zmieniają nagłówek i podpis tokenu.
- Dodawaj deklaracje takie jak `sub`, `iss`, `aud`, `exp`, `iat`, `scope` albo niestandardowe pola aplikacji bez pisania jednorazowego skryptu.
- Generuj tokeny ze wspólnymi sekretami HMAC albo z kluczami prywatnymi RSA/ECDSA w formacie PKCS#8 PEM lub JWK.

## Co sprawdzić przed użyciem podpisanego tokenu

- Dopasuj algorytm do typu klucza: `HS*` używa wspólnego sekretu, `RS*` i `PS*` używają kluczy prywatnych RSA, a `ES*` używa kluczy prywatnych EC.
- Dodaj deklaracje wygaśnięcia i odbiorców, gdy usługa odbierająca ich oczekuje.
- Nie używaj produkcyjnych kluczy prywatnych we współdzielonych przeglądarkach i komputerach. To narzędzie działa lokalnie, ale nie może chronić kluczy przed urządzeniem, które zostało już przejęte.
- Pamiętaj, że podpisywanie nie jest szyfrowaniem. Każdy, kto otrzyma token, może zdekodować nagłówek i payload.
