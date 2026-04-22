## Apakah penukaran JWK ↔ PEM?

JWK (JSON Web Key) ialah format JSON untuk kunci kriptografi yang digunakan dalam sistem JOSE/JWT. Ia boleh mewakili kunci RSA, EC atau OKP dan boleh berada dalam JWK Set (JWKS).

PEM ialah kunci ASN.1/DER yang dikod Base64 dengan baris pengepala seperti BEGIN PUBLIC KEY atau BEGIN PRIVATE KEY, lazim dalam TLS, OpenSSL dan banyak SDK.

Alat ini menukar kunci dua hala, mengekalkan bahan kunci ketika memilih output awam (SPKI) atau peribadi (PKCS8). Menyokong RSA, EC (P-256/384/521) dan OKP (Ed25519/X25519/Ed448/X448), dan semuanya berjalan secara tempatan dalam pelayar.

Pilih JWK → PEM apabila pustaka, gerbang atau CLI menjangkakan fail kunci gaya OpenSSL. Pilih PEM → JWK apabila anda perlu meletakkan kunci dalam JWKS, menghantarnya melalui konfigurasi berasaskan JSON atau menggunakannya dalam persekitaran pelayar atau serverless. Penukaran kunci peribadi mengekalkan bahan peribadi, jadi kongsi hanya output awam jika itu sahaja yang diperlukan.

- Gunakan kunci JWK/JWKS dalam sistem yang hanya menerima PEM.
- Eksport kunci PEM untuk pustaka JWT, gerbang API atau pengedaran kunci.
- Kongsi kunci awam dengan selamat tanpa mendedahkan data kunci peribadi.
