## Apakah HMAC?

HMAC (Kod Pengesahan Mesej berasaskan Hash) ialah mekanisme kriptografi yang menggabungkan kunci rahsia dengan fungsi hash untuk mengesahkan kedua-dua integriti data dan ketulenan mesej.

**Cara ia berfungsi:**

1. Kunci rahsia digabungkan dengan mesej
2. Fungsi hash (seperti SHA-256) memproses data gabungan
3. Hasilnya adalah kod pengesahan bersaiz tetap

**Kes penggunaan biasa:**

- **Pengesahan API**: Menandatangani permintaan API untuk mengesahkan penghantar
- **Token JWT**: Digunakan dalam algoritma HS256/HS384/HS512
- **Pengesahan Mesej**: Memastikan data tidak diusik
- **Tandatangan Webhook**: Mengesahkan muatan webhook

**Nota keselamatan:**

- Sentiasa gunakan kunci rahsia yang kuat dan rawak
- Simpan kunci rahsia anda dengan selamat
- SHA-256 atau lebih tinggi disyorkan untuk aplikasi baru
- SHA-1 dianggap lemah dan harus dielakkan untuk kegunaan kritikal keselamatan
