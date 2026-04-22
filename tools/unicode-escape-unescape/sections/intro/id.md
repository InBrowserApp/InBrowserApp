## Apa Itu Unicode Escaping?

Unicode escaping mengonversi karakter menjadi urutan kode yang merepresentasikan code point Unicode-nya. Ini penting ketika kode sumber, file konfigurasi, atau format data tidak dapat memuat karakter tertentu secara langsung.

**Format escape umum:**

- `\uXXXX` — JavaScript / JSON, digunakan di sebagian besar bahasa pemrograman
- `\u{XXXXX}` — JavaScript ES6+, mendukung karakter suplementer tanpa surrogate pair
- `&#xXXXX;` / `&#DDDD;` — Entitas HTML dalam bentuk heksadesimal atau desimal
- `U+XXXX` — Notasi Unicode standar yang digunakan dalam dokumentasi
- `\xXX` / `%XX` — Encoding level byte UTF-8, umum di URL dan bahasa mirip C
- `\UXXXXXXXX` — Format Python 8-digit untuk code point apa pun
- `0xXXXX` — Notasi literal heksadesimal

## Kapan menggunakan alat ini

- Menyisipkan karakter non-ASCII dalam kode sumber atau file konfigurasi yang memerlukan encoding ASCII-safe
- Men-debug teks rusak dengan memeriksa code point Unicode yang mendasarinya
- Mengonversi antar notasi escape saat memindahkan kode antar bahasa atau format
- Menyiapkan teks untuk konteks JSON, HTML, atau URL yang memerlukan karakter ter-encode

## Cara kerja

Ketik atau tempel teks biasa di sebelah kiri dan alat ini akan meng-escape karakter non-ASCII menggunakan format yang dipilih. Tempel teks ter-escape di sebelah kanan dan alat ini akan otomatis mendeteksi serta mendekode semua format yang didukung secara bersamaan. Semuanya berjalan secara lokal di browser.
