## Apa itu Kode Status HTTP?

Kode status HTTP adalah kode respons tiga digit yang dikembalikan server untuk menunjukkan apa yang terjadi pada sebuah permintaan. Anda akan sering melihatnya di alat pengembang browser, respons API, log server, pemeriksaan uptime, dan dasbor reverse proxy.

### Cara Membaca Keluarga Kode Status Utama

- **1xx Informasional:** Server telah menerima permintaan dan proses masih berlangsung.
- **2xx Sukses:** Permintaan berhasil diselesaikan.
- **3xx Pengalihan:** Klien perlu mengikuti lokasi lain atau memakai ulang hasil yang tersimpan di cache.
- **4xx Kesalahan Klien:** Permintaannya sendiri bermasalah, seperti sumber daya hilang, input tidak valid, atau autentikasi gagal.
- **5xx Kesalahan Server:** Server atau dependensi upstream gagal saat menangani permintaan yang valid.

### Kapan lookup ini berguna

Gunakan alat ini saat Anda perlu memastikan arti suatu kode, membandingkan kode yang mirip seperti 401 dan 403 atau 502 dan 504, atau mencari berdasarkan frasa dari pesan galat. Pencarian mendukung kode, nama status, dan deskripsi yang dilokalkan.

### Mengapa interpretasi yang benar penting

Saat debugging, kode status sering menjadi petunjuk tercepat. Respons 4xx biasanya menunjuk ke permintaan, kredensial, atau sumber daya tujuan. Respons 5xx biasanya menunjuk ke aplikasi, gateway, atau layanan upstream. Membaca kategorinya lebih dulu membantu memilih langkah berikutnya dengan tepat.
