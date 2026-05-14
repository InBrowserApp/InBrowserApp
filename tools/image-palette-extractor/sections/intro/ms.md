## Perkara yang dilakukan alat ini

Pengekstrak Palet Imej mencari warna dominan dalam imej secara langsung dalam
pelayar anda. Alat ini mensampel gambar, mengumpulkan piksel yang serupa secara
visual, dan mengembalikan palet praktikal dengan nilai HEX, RGB, HSL, dan
peratusan untuk setiap warna.

## Kes penggunaan yang sesuai

- Ambil warna jenama atau produk daripada tangkapan skrin, logo, foto, atau
  mockup.
- Bina palet CSS pantas untuk halaman pendaratan, imej kecil, atau serahan
  reka bentuk.
- Bandingkan sejauh mana sesebuah imej dipengaruhi oleh satu warna dominan
  berbanding aksen sokongan.
- Bekerja dengan imej peribadi tanpa menghantar fail ke pelayan.

## Pilihan eksport

Hasil boleh disalin sebagai senarai HEX biasa, sifat tersuai CSS, atau JSON.
Format CSS berguna apabila anda mahu pemboleh ubah seperti `--palette-1`,
manakala JSON mengekalkan format warna dan nisbah dominasi bersama-sama untuk
skrip atau automasi reka bentuk.

## Perkara yang perlu diberi perhatian

- Pengekstrakan palet adalah anggaran. Ia bertujuan menghasilkan kumpulan visual
  yang berguna, bukan inventori lengkap bagi setiap warna piksel.
- Piksel lutsinar diabaikan secara lalai supaya ikon dan potongan tidak memesongkan
  palet; matikan pilihan itu apabila kelutsinaran itu sendiri merupakan sebahagian
  daripada karya.
- Tetapan kualiti tepat mensampel lebih banyak piksel dan boleh menjadi
  lebih perlahan pada imej yang sangat besar.
