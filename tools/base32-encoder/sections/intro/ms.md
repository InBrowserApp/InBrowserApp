## Apakah Base32?

Base32 berguna apabila saluran teks sahaja atau saluran yang tidak peka huruf besar-kecil perlu membawa data binari, seperti rahsia OTP, token yang selamat untuk DNS, atau nilai konfigurasi yang dieksport. Ia ialah lapisan pengekodan, bukannya lapisan keselamatan.

## Bila hendak menggunakannya

- Mengekod bait, teks atau fail ke Base32 sebelum menghantarnya melalui saluran teks sahaja.
- Menyediakan rahsia OTP, tetapan yang dieksport atau blob binari untuk sistem yang mengharapkan input Base32.
- Menukar bait fail mentah kepada rentetan yang mudah disalin untuk penghantaran, log atau input manual.

## Perkara yang perlu diingat

- Base32 menambah saiz data lebih banyak daripada Base64.
- Ia tidak menyulitkan atau menyembunyikan nilai asal.
- Sesetengah sistem memerlukan padding `=`, manakala yang lain menerima output tanpa padding, jadi sebaiknya ikut jangkaan penerima.
