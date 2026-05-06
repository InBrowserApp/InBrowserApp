# Kalkulator Checksum CRC

Checksum CRC (Cyclic Redundancy Check) ialah nilai padat yang digunakan untuk
mengesan perubahan data yang tidak disengajakan. Nilai ini lazim digunakan
dalam bingkai rangkaian, format arkib, protokol terbenam, kemas kini perisian
tegar dan aliran kerja integriti fail apabila nilai pengesanan ralat yang
pantas lebih berguna daripada tandatangan kriptografi.

## Bila menggunakannya

Gunakan kalkulator ini apabila anda perlu membandingkan nilai CRC daripada
dokumentasi, protokol perkakasan, format fail atau sistem lain. Tampal teks
untuk semakan pantas, atau import fail apabila checksum perlu dikira daripada
aliran bait yang tepat.

## Varian yang disokong

Alat ini mengira varian biasa daripada alat CRC InBrowser.App yang lama:
CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM, dan beberapa model CRC-64 termasuk ECMA-182, GO-ISO, MS, NVME, REDIS,
WE dan XZ.

## Perkara yang perlu diberi perhatian

Nama varian CRC penting. Input yang sama boleh menghasilkan nilai yang berbeza
bergantung pada polinomial, nilai awal, tetapan refleksi dan XOR akhir. Jika
anda memadankan spesifikasi protokol atau vendor, pilih keputusan yang nama
variannya sepadan dengan spesifikasi tersebut dan bukannya menganggap setiap
lebar CRC boleh saling ditukar ganti.

CRC direka untuk pengesanan ralat tidak sengaja, bukan untuk penyimpanan kata
laluan, tandatangan atau keselamatan kalis usik. Untuk pengesahan yang sensitif
terhadap keselamatan, gunakan aliran kerja hash kriptografi atau tandatangan.
