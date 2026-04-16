## Apakah Base32?

Base32 berguna apabila saluran teks sahaja atau saluran yang tidak peka huruf besar-kecil perlu membawa data binari, seperti rahsia OTP, token yang selamat untuk DNS, atau nilai konfigurasi yang dieksport. Ia ialah lapisan pengekodan, bukannya lapisan keselamatan.

## Bila hendak menggunakannya

- Menyahkod rahsia atau token Base32 kembali kepada bait asalnya.
- Menyemak nilai yang disalin daripada persediaan TOTP, eksport integrasi, atau fail konfigurasi.
- Memastikan data Base32 yang ditampal mempunyai aksara yang sah dan padding yang betul sebelum digunakan.

## Perkara yang perlu diingat

- Base32 menambah saiz data lebih banyak daripada Base64.
- Ia tidak menyulitkan atau menyembunyikan nilai asal.
- Sesetengah sistem menggugurkan padding `=`, tetapi aksara tidak sah tetap menyebabkan ralat nyahkod.
