## Apa itu Alamat IPv6 Link-Local?

Alamat IPv6 Link-Local adalah alamat IPv6 khusus yang secara otomatis dikonfigurasi pada setiap antarmuka yang mendukung IPv6. Mereka selalu dimulai dengan awalan fe80::/10 dan digunakan untuk komunikasi antar perangkat pada segmen jaringan yang sama. Alamat-alamat ini tidak dapat dirutekan di luar tautan lokal dan umumnya digunakan untuk penemuan tetangga, penemuan router, dan protokol jaringan lokal lainnya. Alamat link-local dapat dihasilkan dari alamat MAC perangkat menggunakan format EUI-64.

### Kapan alat ini berguna

Gunakan alat ini saat Anda membutuhkan alamat link-local deterministik yang diturunkan EUI-64 dari alamat MAC perangkat.

### Cara kerja pemetaan EUI-64

1. Normalkan alamat MAC menjadi 48 bit.
2. Balik `U/L bit` pada byte pertama.
3. Sisipkan `ff:fe` di tengah untuk membuat pengenal antarmuka 64 bit.
4. Tambahkan prefiks `fe80::/10`.

### Format input yang didukung

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Sufiks antarmuka opsional

Tambahkan `%eth0`, `%en0`, atau indeks zona lain hanya saat perintah lokal perlu mengetahui antarmuka mana yang harus dipakai.
