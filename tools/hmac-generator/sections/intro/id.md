## Apa itu HMAC?

HMAC (Hash-based Message Authentication Code) adalah mekanisme kriptografi yang menggabungkan kunci rahasia dengan fungsi hash untuk memverifikasi integritas data dan keaslian pesan.

**Cara kerjanya:**

1. Kunci rahasia digabungkan dengan pesan
2. Fungsi hash (seperti SHA-256) memproses data gabungan
3. Hasilnya adalah kode autentikasi berukuran tetap

**Kasus penggunaan umum:**

- **Autentikasi API**: Menandatangani permintaan API untuk memverifikasi pengirim
- **Token JWT**: Digunakan dalam algoritma HS256/HS384/HS512
- **Verifikasi Pesan**: Memastikan data tidak dirusak
- **Tanda Tangan Webhook**: Memvalidasi payload webhook

**Catatan keamanan:**

- Selalu gunakan kunci rahasia yang kuat dan acak
- Jaga kerahasiaan kunci rahasia Anda
- SHA-256 atau lebih tinggi direkomendasikan untuk aplikasi baru
- SHA-1 dianggap lemah dan harus dihindari untuk penggunaan kritis keamanan
