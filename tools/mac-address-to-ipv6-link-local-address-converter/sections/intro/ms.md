## Apakah Alamat IPv6 Link-Local?

Alamat IPv6 Link-Local adalah alamat IPv6 khas yang dikonfigurasi secara automatik pada setiap antara muka yang didayakan IPv6. Mereka sentiasa bermula dengan awalan fe80::/10 dan digunakan untuk komunikasi antara peranti dalam segmen rangkaian yang sama. Alamat-alamat ini tidak boleh dihalakan di luar pautan tempatan dan biasanya digunakan untuk penemuan jiran, penemuan penghala, dan protokol rangkaian tempatan yang lain. Alamat link-local boleh dijana daripada alamat MAC peranti menggunakan format EUI-64.

### Bila alat ini berguna

Gunakan alat ini apabila anda memerlukan alamat link-local deterministik yang diterbitkan oleh EUI-64 daripada alamat MAC peranti.

### Cara pemetaan EUI-64 berfungsi

1. Normalkan alamat MAC kepada 48 bit.
2. Songsangkan `U/L bit` pada bait pertama.
3. Sisipkan `ff:fe` di tengah untuk membentuk pengecam antara muka 64 bit.
4. Tambahkan awalan `fe80::/10`.

### Format input yang disokong

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Akhiran antara muka pilihan

Tambahkan `%eth0`, `%en0` atau indeks zon lain hanya apabila arahan setempat perlu mengetahui antara muka yang patut digunakan.
