## Czym jest parser certyfikatów X.509?

Certyfikat X.509 to podpisany dokument, który wiąże klucz publiczny z tożsamością, taką jak domena, usługa, organizacja lub osoba. Certyfikaty TLS, pliki łańcuchów certyfikatów oraz wiele przepływów pracy S/MIME lub podpisywania używa tego formatu.

Ten parser odczytuje materiał certyfikatów i kluczy publicznych bezpośrednio w przeglądarce. Może sprawdzać bloki PEM, binarne pliki DER i tekst base64 DER, a następnie pokazywać podmiot, wystawcę, numer seryjny, okres ważności, algorytm podpisu, algorytm klucza publicznego, odciski palca i typowe rozszerzenia.

Użyj go, gdy musisz porównać odcisk palca certyfikatu, sprawdzić, czy certyfikat dotyczy oczekiwanego hosta, przejrzeć Subject Alternative Names, potwierdzić użycie klucza albo wyodrębnić szczegóły klucza publicznego podczas diagnozowania problemów z TLS i wdrożeniem.

Narzędzie nie sprawdza łańcuchów zaufania ani nie kontaktuje się z urzędami certyfikacji. Pokazuje to, co jest zakodowane w dostarczonym certyfikacie lub kluczu publicznym, dlatego gdy potrzebujesz walidacji odwołania, łańcucha, nazwy hosta albo aktywnego punktu końcowego, użyj dedykowanego skanera TLS.

- Porównuj odciski palca SHA-256 lub SHA-1 przed instalowaniem albo rotacją certyfikatów.
- Przeglądaj SAN, użycie klucza, rozszerzone użycie klucza i podstawowe ograniczenia bez przesyłania materiału certyfikatu.
- Sprawdzaj samodzielne klucze publiczne SPKI, gdy usługa udostępnia tylko plik public-key PEM lub DER.
