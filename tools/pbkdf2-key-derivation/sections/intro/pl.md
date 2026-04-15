## Czym jest PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) wyprowadza klucz kryptograficzny z hasła, używając soli i wielu iteracji. Spowalnia ataki brute‑force i generuje różne klucze, gdy sól się zmienia.

**Kluczowe punkty:**

- Używa HMAC z wybranym hashem (SHA-1/SHA-256 itp.)
- Więcej iteracji zwiększa koszt obliczeń
- Długość wyjścia jest konfigurowalna

**Dobre praktyki:**

- Używaj unikalnej, losowej soli
- Wybieraj więcej iteracji w granicach akceptowalnej wydajności
- Dla nowych systemów rozważ Argon2 lub scrypt
