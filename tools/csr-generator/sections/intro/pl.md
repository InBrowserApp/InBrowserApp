# Generator CSR

Certificate Signing Request (CSR), czyli żądanie podpisania certyfikatu, to komunikat PKCS#10 zawierający klucz publiczny, identyfikujące pola Subject, opcjonalne rozszerzenia takie jak Subject Alternative Names oraz podpis wykonany pasującym kluczem prywatnym. Urzędy certyfikacji używają CSR do wydania certyfikatu X.509 bez otrzymywania Twojego klucza prywatnego.

Ten generator tworzy CSR bezpośrednio w przeglądarce. Możesz wygenerować nową parę kluczy RSA lub ECDSA albo zaimportować istniejący niezaszyfrowany prywatny klucz PEM, gdy musisz odnowić certyfikat dla klucza, który jest już wdrożony.

## Kiedy go używać

Użyj CSR, gdy potrzebujesz, aby urząd certyfikacji wydał lub odnowił certyfikat TLS, S/MIME, uwierzytelniania klienta albo certyfikat wewnętrznej usługi. CSR potwierdza posiadanie klucza prywatnego i przenosi publiczne informacje o tożsamości, które powinny znaleźć się w certyfikacie.

W przypadku publicznych certyfikatów TLS umieszczaj nazwy hostów w Subject Alternative Names. Common Name nadal pomaga w czytelności i systemach starszego typu, ale nowoczesne klienty sprawdzają nazwy DNS i adresy IP z SAN.

## Jak wygenerować CSR

Wybierz, czy chcesz wygenerować nowy klucz, czy zaimportować istniejący klucz prywatny. Wypełnij pola Subject potrzebne dla żądania certyfikatu, a następnie dodaj wpisy SAN dla nazw DNS, adresów IP, adresów e-mail lub URI. Wygeneruj CSR i wyślij do urzędu certyfikacji tylko CSR PEM.

Jeśli narzędzie wygeneruje nowy klucz, pobierz i zapisz klucz prywatny przed opuszczeniem strony. Jeśli importujesz klucz, narzędzie generuje tylko CSR i nie eksportuje ponownie zaimportowanego klucza prywatnego.

## Uwagi dotyczące kluczy i formatu

RSA 2048 bitów jest szeroko zgodne; 3072 lub 4096 bitów może być preferowane dla dłużej używanych certyfikatów wewnętrznych. ECDSA P-256 jest kompaktowe i szeroko obsługiwane, a P-384 lub P-521 mogą być wymagane przez bardziej rygorystyczne polityki. Ścieżka importu klucza obsługuje niezaszyfrowane bloki PEM PKCS#8, RSA PRIVATE KEY i EC PRIVATE KEY.

Klucze prywatne są poufne. Nie wklejaj ich w niezaufanych witrynach, nie wysyłaj ich do urzędów certyfikacji i nie zapisuj ich w systemie kontroli wersji. To narzędzie działa lokalnie w przeglądarce, ale Twój proces operacyjny nadal wymaga bezpiecznego przechowywania i rotacji kluczy.
