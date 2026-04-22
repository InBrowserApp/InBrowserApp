## Apa itu konversi JWK ↔ PEM?

JWK (JSON Web Key) adalah format JSON untuk kunci kriptografi yang digunakan dalam sistem JOSE/JWT. JWK dapat merepresentasikan kunci RSA, EC, atau OKP dan bisa berada dalam JWK Set (JWKS).

PEM adalah kunci ASN.1/DER yang dikodekan Base64 dengan baris header seperti BEGIN PUBLIC KEY atau BEGIN PRIVATE KEY, umum di TLS, OpenSSL, dan banyak SDK.

Alat ini mengonversi kunci dua arah, menjaga materi kunci saat memilih output publik (SPKI) atau privat (PKCS8). Mendukung RSA, EC (P-256/384/521), dan OKP (Ed25519/X25519/Ed448/X448), dan semuanya berjalan lokal di browser Anda.

Pilih JWK → PEM saat library, gateway, atau CLI mengharapkan file kunci bergaya OpenSSL. Pilih PEM → JWK saat Anda perlu memasukkan kunci ke dalam JWKS, mengirimkannya melalui konfigurasi berbasis JSON, atau memakainya di lingkungan browser maupun serverless. Konversi kunci privat tetap mempertahankan material privat, jadi bagikan hanya keluaran publik jika itu saja yang dibutuhkan.

- Gunakan kunci JWK/JWKS pada sistem yang hanya menerima PEM.
- Ekspor kunci PEM untuk pustaka JWT, gateway API, atau distribusi kunci.
- Bagikan kunci publik dengan aman tanpa mengekspos data kunci privat.
