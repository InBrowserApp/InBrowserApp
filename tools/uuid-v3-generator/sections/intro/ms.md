## Apakah UUID v3?

UUID v3 ialah format UUID berasaskan nama. Ia mengambil UUID ruang nama dan
nama, menghash kedua-duanya dengan MD5, lalu memformat hasilnya sebagai UUID
standard. Perilaku pentingnya ialah determinisme: ruang nama dan nama yang sama
sentiasa menghasilkan UUID yang sama.

Alat ini berjalan sepenuhnya dalam pelayar anda. Ruang nama, nama dan UUID yang
dijana kekal pada peranti anda melainkan anda menyalin hasilnya ke tempat lain.

## Bila menggunakannya

- Gunakan UUID v3 apabila anda memerlukan pengecam stabil untuk nama yang
  diketahui, seperti nama DNS, URL, laluan objek atau nama pengguna.
- Pilih ruang nama yang sepadan dengan jenis nama yang anda kenal pasti. DNS dan
  URL ialah pratetap yang paling lazim.
- Guna semula ruang nama yang sama secara konsisten. Menukar ruang nama menukar
  setiap UUID yang dijana, walaupun nama kekal sama.
- Utamakan UUID v5 atau pengecam moden lain apabila anda mempunyai pilihan dan
  memerlukan UUID berasaskan nama dengan hash yang lebih kuat. UUID v3 wujud
  untuk keserasian dengan sistem yang secara khusus menjangkakan UUID berasaskan
  MD5.

## Nota keselamatan

UUID v3 bukan ID rawak dan bukan rahsia. Sesiapa yang mengetahui ruang nama dan
nama boleh menjana semula UUID yang sama. Jangan gunakannya untuk kata laluan,
token sesi, kunci API atau nilai lain yang mesti tidak boleh diramal.
