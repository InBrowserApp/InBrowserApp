## Czym jest CSR?

Certificate Signing Request (CSR) to niewielki dokument PKCS#10, który urząd certyfikacji (CA) potrzebuje, aby wystawić certyfikat TLS lub certyfikat podpisywania kodu. Zawiera publiczną część pary kluczy, tożsamość, którą chcesz potwierdzić przez CA (Subject), oraz dodatkowe identyfikatory, takie jak nazwy DNS lub adresy IP (Subject Alternative Names, czyli SAN) — wszystko podpisane odpowiadającym kluczem prywatnym.

To narzędzie buduje CSR w całości w Twojej przeglądarce, korzystając z Web Crypto API i [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Żadne dane dotyczące klucza ani żądania nie są przesyłane na serwer.

## Kiedy używać tego narzędzia

- Złóż wniosek o certyfikat TLS do publicznego CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo itp.), gdy jego proces wymaga wklejenia własnego CSR.
- Wygeneruj CSR dla wewnętrznego urzędu certyfikacji — opartego na ACME, smallstep, EJBCA, AD CS — bez konieczności korzystania z zewnętrznego formularza.
- Ponownie wystawaj certyfikat z tym samym kluczem prywatnym, importując istniejący klucz PKCS#8 PEM i podpisując nowy CSR.

## Jak wypełnić formularz

- **Źródło klucza** — wybierz *Wygeneruj nowy*, aby utworzyć nową parę kluczy, lub *Importuj istniejący*, aby wkleić niezaszyfrowany klucz prywatny PKCS#8 PEM. Klucze zaszyfrowane, starsze bloki `RSA PRIVATE KEY` i `EC PRIVATE KEY` nie są akceptowane; przekonwertuj je najpierw za pomocą `openssl pkcs8 -topk8 -nocrypt`.
- **Algorytm** — RSA zapewnia najszerszą kompatybilność. ECDSA generuje mniejsze podpisy i jest szeroko obsługiwany przez nowoczesne CA i klientów TLS.
- **Subject** — większość publicznych CA ignoruje wszystko poza Common Name i traktuje listę DNS SAN jako miarodajną, jednak prywatne CA mogą nadal wymagać pełnego DN.
- **Wpisy SAN** — podaj nazwy hostów, adresy IP, adresy e-mail lub URI, które mają być objęte certyfikatem. Jeden wpis w wierszu lub oddzielone przecinkami.

## Co warto wiedzieć

- Klucz prywatny wyświetlany obok CSR jest generowany lokalnie i nigdy nie opuszcza przeglądarki. Zapisz go przed zamknięciem karty — bez pasującego klucza prywatnego podpisany certyfikat jest bezużyteczny.
- Publiczne CA wymagają, aby Common Name (lub przynajmniej jeden wpis SAN) była nazwą DNS, którą mogą zweryfikować. Wpisy SAN z adresami IP są przydatne głównie w przypadku certyfikatów wewnętrznych.
- Wygenerowany klucz prywatny jest niezaszyfrowany. Dodaj hasło za pomocą `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem`, jeśli potrzebujesz go przed zapisaniem.
- Obsługiwane są wyłącznie RSA (2048/3072/4096) i ECDSA (P-256/P-384/P-521). EdDSA zostało celowo pominięte, ponieważ jego obsługa w przeglądarkach i urzędach certyfikacji jest nadal niespójna.
