## Apakah kunci sistem Motorola legasi?

Kunci sistem perisian ialah fail `.KEY` yang digunakan oleh perisian pengaturcaraan Motorola yang serasi untuk membolehkan penyuntingan tetapan sistem trunking yang dilindungi. Penjana ini menghasilkan semula format legasi berasaskan BatLabs untuk sesuatu ID Sistem. Kunci sistem berbeza daripada kunci penyulitan trafik radio dan dengan sendirinya tidak memberikan akses kepada rangkaian radio.

## Cara menggunakan penjana ini

1. Masukkan ID Sistem menggunakan 1–4 digit heksadesimal (`0–9`, `A–F`), tanpa awalan `0x`. Huruf kecil diterima dan ID pendek ditambah sifar di hadapan: `ab` menjadi `00AB`.
2. Semak ID yang dinormalkan, nama fail dan pratonton heksadesimal.
3. Muat turun fail binari `.KEY` dan muatkannya dalam perisian pengaturcaraan legasi yang serasi. Saiz fail ialah 27 bait; ID Sistem `1234` menghasilkan `SYS01234.KEY`.

## Had keserasian

Alat ini mengikuti format legasi yang telah diterbitkan; keserasian bergantung pada perisian pengaturcaraan. Alat ini tidak menyokong ASTRO 25 Portable CPS (termasuk XTS5000), APX CPS atau Advanced System Keys (ASK). Padanan dengan format bait rujukan tidak mengesahkan keserasian dengan radio atau versi CPS tertentu.

## Privasi

Penjanaan, pengesahan dan pratonton fail dijalankan secara setempat dalam pelayar anda. ID Sistem anda dan kunci yang dijana tidak dihantar ke pelayan.
