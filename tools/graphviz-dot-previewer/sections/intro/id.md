## Pratinjau graf Graphviz DOT secara online

Tempel kode DOT dari file, skrip, atau dokumentasi ke kolom **Kode DOT**. Graf diperbarui saat Anda mengetik. Gunakan `digraph` dan `->` untuk sisi berarah, atau `graph` dan `--` untuk sisi tak berarah. Pilih contoh bawaan untuk melihat cara menuliskan dependensi, jaringan, dan klaster.

## Pilih mesin tata letak Graphviz

Mulai dengan `dot` untuk graf berlapis, seperti dependensi build. Coba `neato` atau `fdp` untuk menyebarkan simpul dalam jaringan tak berarah, `sfdp` untuk jaringan yang lebih besar, `circo` untuk tata letak melingkar, atau `twopi` untuk pohon radial. Graphviz juga menyediakan `osage` untuk graf berklaster dan `patchwork` untuk peta pohon. Kode DOT tetap ada di editor saat Anda mengganti mesin.

## Pahami catatan tata letak dan kesalahan sintaks

Graphviz dapat melaporkan kesalahan jika operator sisi tidak cocok dengan jenis graf atau jika tanda kurung kurawal atau tanda kutip tidak lengkap. Periksa baris yang dilaporkan dan baris sebelumnya. Pratinjau juga dapat disertai catatan tentang atribut yang tidak bisa diterapkan. Jika graf menentukan atribut `layout`, Graphviz menggunakan mesin yang tercantum di sana. Baca [referensi bahasa DOT](https://graphviz.org/doc/info/lang.html) dan [panduan tata letak Graphviz](https://graphviz.org/docs/layouts/) untuk detail sintaks dan mesin.
