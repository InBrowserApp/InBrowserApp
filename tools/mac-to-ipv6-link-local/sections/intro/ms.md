## Apakah Alamat IPv6 Link-Local?

Alamat IPv6 Link-Local adalah alamat IPv6 khas yang dikonfigurasi secara automatik pada setiap antara muka yang didayakan IPv6. Mereka sentiasa bermula dengan awalan fe80::/10 dan digunakan untuk komunikasi antara peranti dalam segmen rangkaian yang sama. Alamat-alamat ini tidak boleh dihalakan di luar pautan tempatan dan biasanya digunakan untuk penemuan jiran, penemuan penghala, dan protokol rangkaian tempatan yang lain. Alamat link-local boleh dijana daripada alamat MAC peranti menggunakan format EUI-64.

### Format input

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Output EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Akhiran antara muka

- `%eth0`
- `%en0`
- `%wlan0`
