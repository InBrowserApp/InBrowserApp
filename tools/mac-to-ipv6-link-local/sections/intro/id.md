## Apa itu Alamat IPv6 Link-Local?

Alamat IPv6 Link-Local adalah alamat IPv6 khusus yang secara otomatis dikonfigurasi pada setiap antarmuka yang mendukung IPv6. Mereka selalu dimulai dengan awalan fe80::/10 dan digunakan untuk komunikasi antar perangkat pada segmen jaringan yang sama. Alamat-alamat ini tidak dapat dirutekan di luar tautan lokal dan umumnya digunakan untuk penemuan tetangga, penemuan router, dan protokol jaringan lokal lainnya. Alamat link-local dapat dihasilkan dari alamat MAC perangkat menggunakan format EUI-64.

### Format input

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Output EUI-64

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Sufiks antarmuka

- `%eth0`
- `%en0`
- `%wlan0`
