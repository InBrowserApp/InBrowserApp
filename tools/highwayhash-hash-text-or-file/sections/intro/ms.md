## Apakah itu HighwayHash?

HighwayHash ialah fungsi hash berkunci pantas yang direka oleh Google untuk cap jari berdaya pemprosesan tinggi dan semakan integriti. Ia menggunakan kunci 256-bit dan boleh menghasilkan output 64-bit, 128-bit, atau 256-bit daripada input teks atau fail yang sama.

## Bila menggunakannya

- Bina checksum berkunci deterministik untuk kunci cache, ID objek, sharding, atau jadual carian dalaman.
- Bandingkan fail atau muatan teks dengan kunci yang sama apabila kelajuan lebih penting daripada keserasian kriptografi yang luas.
- Jana cap jari 128-bit atau 256-bit apabila hash bukan kata laluan yang lebih besar berguna untuk aliran kerja integriti.

## Pilihan kunci dan output

Masukkan kunci sebagai tepat 32 bait data heksadesimal, seperti `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Awalan `0x` adalah pilihan, dan alat ini menerima ruang, titik bertindih, tanda sempang, dan garis bawah untuk menjadikan kunci panjang lebih mudah dibaca. Membiarkan kunci kosong akan menggunakan kunci lalai pustaka, yang mudah untuk semakan pantas tetapi tidak patut dianggap sebagai rahsia.

## Nota keselamatan

HighwayHash bukan pengganti HMAC, tandatangan digital, atau penghashan kata laluan. Gunakannya untuk cap jari berkunci pantas dan aliran kerja checksum, bukan untuk membuktikan ketulenan merentas sistem yang memerlukan pengesahan kriptografi standard.
