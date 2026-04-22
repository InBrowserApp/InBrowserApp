## Apakah Local Font Access?

Local Font Access ialah API pelayar untuk menyenaraikan fon yang dipasang pada peranti.

Alat ini membolehkan anda mencari hasil, membandingkan varian berkaitan dan menyalin petikan CSS untuk fon yang dipilih.

Hanya berfungsi dalam konteks selamat dan pelayar yang disokong, serta memerlukan izin pengguna (local-fonts).

API mengembalikan FontData dengan family, fullName, postscriptName dan style.

### Perkara penting

- Gunakannya untuk mengesahkan nama tepat yang anda perlukan bagi tindanan CSS `font-family` pada peranti semasa.
- Panggilan mesti dicetuskan oleh interaksi pengguna.
- Permissions Policy boleh menyekat akses di sesetengah laman.
- Alat ini berjalan secara tempatan dan tidak memuat naik fon.
