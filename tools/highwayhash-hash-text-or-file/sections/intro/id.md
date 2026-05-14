## Apa itu HighwayHash?

HighwayHash adalah fungsi hash berkunci yang cepat, dirancang oleh Google untuk fingerprinting ber-throughput tinggi dan pemeriksaan integritas. Fungsi ini menggunakan kunci 256-bit dan dapat menghasilkan output 64-bit, 128-bit, atau 256-bit dari input teks atau file yang sama.

## Kapan menggunakannya

- Buat checksum berkunci yang deterministik untuk kunci cache, ID objek, sharding, atau tabel pencarian internal.
- Bandingkan file atau payload teks dengan kunci yang sama ketika kecepatan lebih penting daripada kompatibilitas kriptografis yang luas.
- Buat fingerprint 128-bit atau 256-bit ketika hash non-password yang lebih besar berguna untuk alur kerja integritas.

## Opsi kunci dan output

Masukkan kunci sebagai tepat 32 byte data heksadesimal, seperti `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Prefiks `0x` bersifat opsional, dan alat ini menerima spasi, titik dua, tanda hubung, dan garis bawah agar kunci panjang lebih mudah dibaca. Mengosongkan kunci akan memakai kunci default library, yang praktis untuk pemeriksaan cepat tetapi tidak boleh dianggap rahasia.

## Catatan keamanan

HighwayHash bukan pengganti HMAC, tanda tangan digital, atau hashing kata sandi. Gunakan untuk fingerprint berkunci yang cepat dan alur kerja checksum, bukan untuk membuktikan autentisitas antar sistem yang membutuhkan verifikasi kriptografis standar.
