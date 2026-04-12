## Apa Itu Prettier Code Formatter?

Prettier Code Formatter menjalankan pipeline resmi Prettier standalone langsung
di browser Anda, sehingga Anda bisa menormalkan file sumber tanpa mengirim kode
ke server. Ini berguna saat Anda ingin melakukan pemformatan cepat, membandingkan
pengaturan lebar baris yang berbeda, atau membutuhkan file bersih yang bisa
langsung disalin atau diunduh.

## Format Yang Didukung

Rewrite ini tetap memusatkan alat pada format yang memang sudah ditangani
Prettier dengan baik di browser: JavaScript, TypeScript, Flow, JSON, HTML, CSS,
SCSS, Less, Markdown, MDX, YAML, GraphQL, dan format templat terkait seperti
Vue dan Handlebars. Pemilih bahasa menentukan parser yang berjalan, dan saat
mengimpor file parser akan terdeteksi otomatis jika ekstensinya dikenali.

## Cara Rewrite Ini Bekerja

Rewrite ini menjaga logika pemformatan berat tetap di luar jalur UI utama.
Permintaan pemformatan dibangun dari konfigurasi tool yang murni, lalu dijalankan
melalui pipeline Prettier berbasis worker yang diload secara lazy agar pengetikan
biasa tetap responsif. Input besar menjeda pemformatan otomatis dan beralih ke
aksi eksplisit `Format now`, yang lebih dapat diprediksi daripada mencoba
memformat ulang file besar pada setiap penekanan tombol.
