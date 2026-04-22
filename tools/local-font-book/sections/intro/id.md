## Apa itu Local Font Access?

Local Font Access adalah API browser yang menampilkan font terpasang di perangkat.

Alat ini memungkinkan Anda menelusuri hasil, membandingkan varian terkait, dan menyalin cuplikan CSS untuk font yang dipilih.

Hanya bekerja di konteks aman dan browser yang mendukung, serta membutuhkan izin pengguna (local-fonts).

API mengembalikan FontData dengan family, fullName, postscriptName, dan style.

### Poin penting

- Gunakan alat ini untuk memastikan nama yang tepat yang Anda perlukan untuk stack CSS `font-family` pada perangkat saat ini.
- Pemanggilan harus dipicu oleh interaksi pengguna.
- Permissions Policy dapat memblokir akses di beberapa situs.
- Alat ini berjalan secara lokal dan tidak mengunggah font.
