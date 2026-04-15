## Apa itu KSUID?

KSUID (K-Sortable Unique IDentifier) adalah identifikator base62 sepanjang 27 karakter yang berisi timestamp 32-bit (detik sejak 2014-05-13) dan 128 bit data acak.

**Poin utama:**

- **Dapat diurutkan menurut waktu**: urutan leksikografis mengikuti waktu pembuatan.
- **Keunikan tinggi**: 128 bit keacakan per ID.
- **Presisi detik**: KSUID hanya menyimpan detik, input milidetik dibulatkan ke bawah.
