## Apakah CSR?

Certificate Signing Request (CSR) adalah dokumen PKCS#10 kecil yang diperlukan oleh pihak berkuasa sijil (CA) untuk mengeluarkan sijil TLS atau penandatanganan kod. Ia menggabungkan bahagian awam pasangan kunci, identiti yang anda mahu CA akui (Subject), dan pengecam tambahan seperti nama DNS atau alamat IP (Subject Alternative Names, atau SAN), semuanya ditandatangani oleh kunci peribadi yang sepadan.

Alat ini membina CSR sepenuhnya dalam pelayar anda menggunakan Web Crypto API dan [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Tiada maklumat tentang kunci atau permintaan anda yang dihantar ke pelayan.

## Bila menggunakan alat ini

- Minta sijil TLS daripada CA awam (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, dll.) apabila aliran kerja mereka meminta anda menampal CSR sendiri.
- Jana CSR untuk pihak berkuasa sijil dalaman — berasaskan ACME, smallstep, EJBCA, AD CS — tanpa mempercayai borang yang dihos.
- Keluarkan semula sijil dengan kunci peribadi yang sama dengan mengimport kunci PEM PKCS#8 sedia ada dan hanya menandatangani CSR baharu.

## Cara mengisi borang

- **Sumber kunci** — pilih *Jana baharu* untuk mencipta pasangan kunci segar, atau *Import sedia ada* untuk menampal kunci PEM PKCS#8 tanpa penyulitan. Kunci yang disulitkan, blok `RSA PRIVATE KEY` lama, dan blok `EC PRIVATE KEY` tidak diterima; tukar terlebih dahulu dengan `openssl pkcs8 -topk8 -nocrypt`.
- **Algoritma** — RSA adalah lalai keserasian yang paling luas. ECDSA menghasilkan tandatangan yang lebih kecil dan disokong secara meluas oleh CA moden dan klien TLS.
- **Subject** — kebanyakan CA awam mengabaikan semua kecuali Common Name dan menganggap senarai DNS SAN sebagai autoriti, tetapi CA peribadi mungkin masih memerlukan DN penuh.
- **Entri SAN** — senaraikan nama hos, IP, alamat e-mel, atau URI yang anda mahu sijil meliputi. Satu setiap baris, atau dipisahkan dengan koma.

## Perkara yang perlu diingat

- Kunci peribadi yang ditunjukkan bersama CSR dijana secara tempatan dan tidak pernah meninggalkan pelayar anda. Simpan sebelum menutup tab — tanpa kunci peribadi yang sepadan, sijil yang ditandatangani tidak boleh digunakan.
- CA awam memerlukan Common Name (atau sekurang-kurangnya satu entri SAN) sebagai nama DNS yang boleh mereka sahkan. SAN alamat IP kebanyakannya berguna untuk sijil dalaman.
- Kunci peribadi yang dijana tidak disulitkan. Tambah frasa laluan dengan `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` jika perlu sebelum menyimpannya.
- Hanya RSA (2048/3072/4096) dan ECDSA (P-256/P-384/P-521) yang disokong. EdDSA sengaja ditinggalkan kerana penerimaannya di seluruh pelayar dan CA masih tidak konsisten.
