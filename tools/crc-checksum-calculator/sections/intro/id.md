# Kalkulator Checksum CRC

Checksum CRC (Cyclic Redundancy Check) adalah nilai ringkas yang digunakan untuk
mendeteksi perubahan data yang tidak disengaja. Nilai ini umum digunakan dalam
frame jaringan, format arsip, protokol tertanam, pembaruan firmware, dan alur
kerja integritas file saat nilai deteksi kesalahan yang cepat lebih berguna
daripada tanda tangan kriptografis.

## Kapan menggunakannya

Gunakan kalkulator ini saat Anda perlu membandingkan nilai CRC dari dokumentasi,
protokol perangkat keras, format file, atau sistem lain. Tempel teks untuk
pemeriksaan cepat, atau impor file saat checksum perlu dihitung dari aliran byte
yang tepat.

## Varian yang didukung

Alat ini menghitung varian umum dari alat CRC InBrowser.App lama: CRC-1, CRC-8,
CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT, CRC-16 Modbus,
CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2, CRCJAM, dan
beberapa model CRC-64 termasuk ECMA-182, GO-ISO, MS, NVME, REDIS, WE, dan XZ.

## Hal yang perlu diperhatikan

Nama varian CRC penting. Input yang sama dapat menghasilkan nilai yang berbeda
tergantung pada polinomial, nilai awal, pengaturan refleksi, dan XOR akhir. Jika
Anda mencocokkan protokol atau spesifikasi vendor, pilih hasil dengan nama
varian yang cocok dengan spesifikasi tersebut, bukan menganggap setiap lebar CRC
dapat dipertukarkan.

CRC dirancang untuk deteksi kesalahan yang tidak disengaja, bukan untuk
penyimpanan kata sandi, tanda tangan, atau keamanan anti-perusakan. Untuk
verifikasi yang sensitif terhadap keamanan, gunakan alur kerja hash kriptografis
atau tanda tangan.
