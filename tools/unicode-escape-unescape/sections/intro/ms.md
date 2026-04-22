## Apakah Itu Pelepasan Unicode?

Pelepasan Unicode menukarkan aksara kepada jujukan berkod yang mewakili titik kod Unicode. Ini penting apabila kod sumber, fail konfigurasi, atau format data tidak boleh mengandungi aksara tertentu secara langsung.

**Format pelepasan biasa:**

- `\uXXXX` — JavaScript / JSON, digunakan dalam kebanyakan bahasa pengaturcaraan
- `\u{XXXXX}` — ES6+ JavaScript, menyokong aksara tambahan tanpa pasangan pengganti
- `&#xXXXX;` / `&#DDDD;` — Entiti HTML dalam bentuk heksadesimal atau perpuluhan
- `U+XXXX` — Notasi Unicode standard yang digunakan dalam dokumentasi
- `\xXX` / `%XX` — Pengekodan peringkat bait UTF-8, biasa dalam URL dan bahasa seperti C
- `\UXXXXXXXX` — Format 8 digit Python untuk sebarang titik kod
- `0xXXXX` — Notasi literal heksadesimal

## Bila menggunakan alat ini

- Membenamkan aksara bukan ASCII dalam kod sumber atau fail konfigurasi yang memerlukan pengekodan selamat ASCII
- Menyahpepijat teks rosak dengan memeriksa titik kod Unicode di sebaliknya
- Menukar antara notasi pelepasan yang berbeza semasa memindahkan antara bahasa atau format
- Menyediakan teks untuk konteks JSON, HTML, atau URL yang memerlukan aksara berkod entiti

## Cara ia berfungsi

Taip atau tampal teks biasa di sebelah kiri dan alat ini akan melepaskan aksara bukan ASCII menggunakan format yang dipilih. Tampal teks yang dilepaskan di sebelah kanan dan ia akan mengesan secara automatik serta menyahkod semua format yang disokong serentak. Semuanya berjalan secara setempat dalam pelayar.
