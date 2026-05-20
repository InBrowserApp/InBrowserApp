## Apa itu CSR?

Certificate Signing Request (CSR) adalah dokumen PKCS#10 kecil yang dibutuhkan oleh certificate authority (CA) untuk menerbitkan sertifikat TLS atau sertifikat penandatanganan kode. Dokumen ini menggabungkan bagian publik dari sepasang kunci, identitas yang ingin Anda minta CA untuk attestasi (Subject), serta pengidentifikasi tambahan seperti nama DNS atau alamat IP (Subject Alternative Names, atau SAN), semuanya ditandatangani oleh kunci privat yang sesuai.

Alat ini membangun CSR sepenuhnya di browser Anda menggunakan Web Crypto API dan [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Tidak ada informasi tentang kunci atau permintaan Anda yang dikirim ke server.

## Kapan menggunakan alat ini

- Meminta sertifikat TLS dari CA publik (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, dll.) ketika alur kerja mereka meminta Anda menempel CSR sendiri.
- Membuat CSR untuk certificate authority internal — berbasis ACME, smallstep, EJBCA, AD CS — tanpa harus mempercayai formulir yang dihosting.
- Menerbitkan ulang sertifikat dengan kunci privat yang sama dengan mengimpor kunci PKCS#8 PEM yang sudah ada dan hanya menandatangani CSR baru.

## Cara mengisi formulir

- **Sumber kunci** — pilih _Buat baru_ untuk membuat pasangan kunci baru, atau _Impor yang ada_ untuk menempel kunci PKCS#8 PEM yang tidak terenkripsi. Kunci terenkripsi, `RSA PRIVATE KEY` lama, dan blok `EC PRIVATE KEY` tidak diterima; konversi terlebih dahulu dengan `openssl pkcs8 -topk8 -nocrypt`.
- **Algoritme** — RSA adalah pilihan dengan kompatibilitas paling luas. ECDSA menghasilkan tanda tangan yang lebih kecil dan didukung secara luas oleh CA modern dan klien TLS.
- **Subject** — sebagian besar CA publik mengabaikan semua kolom kecuali Common Name dan menganggap daftar DNS SAN sebagai referensi utama, tetapi CA privat mungkin masih membutuhkan DN lengkap.
- **Entri SAN** — daftarkan nama host, IP, alamat email, atau URI yang ingin dicakup oleh sertifikat. Satu per baris, atau dipisahkan koma.

## Yang perlu diperhatikan

- Kunci privat yang ditampilkan bersama CSR dibuat secara lokal dan tidak pernah meninggalkan browser Anda. Simpan kunci tersebut sebelum menutup tab — tanpa kunci privat yang sesuai, sertifikat yang telah ditandatangani tidak dapat digunakan.
- CA publik mengharuskan Common Name (atau setidaknya satu entri SAN) berupa nama DNS yang dapat mereka validasi. SAN berupa alamat IP umumnya hanya berguna untuk sertifikat internal.
- Kunci privat yang dihasilkan tidak terenkripsi. Tambahkan passphrase dengan `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` jika diperlukan sebelum menyimpannya.
- Hanya RSA (2048/3072/4096) dan ECDSA (P-256/P-384/P-521) yang didukung. EdDSA sengaja tidak disertakan karena dukungannya di berbagai browser dan CA masih belum konsisten.
