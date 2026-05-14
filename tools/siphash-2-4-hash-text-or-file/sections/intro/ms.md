## Apakah itu SipHash-2-4?

SipHash-2-4 ialah fungsi hash berkunci yang pantas, direka untuk mesej pendek dan perlindungan jadual hash. Ia menggunakan kunci rahsia 128-bit dan menghasilkan output 64-bit, biasanya dipaparkan sebagai nilai heksadesimal 16 aksara.

## Bila menggunakannya

- Lindungi jadual hash sisi pelayan daripada serangan hash-flooding apabila kunci kekal rahsia.
- Bina checksum berkunci deterministik untuk kunci cache, sharding, atau jadual carian dalaman.
- Bandingkan petikan teks atau fail dengan kunci yang sama apabila pengesahan kriptografi tidak diperlukan.

## Format kunci

Masukkan kunci sebagai tepat 16 bait data heksadesimal, seperti `0x000102030405060708090a0b0c0d0e0f`. Awalan `0x` adalah pilihan, dan alat ini menerima ruang, titik bertindih, tanda sempang, dan garis bawah untuk menjadikan kunci panjang lebih mudah dibaca.

## Nota keselamatan

SipHash-2-4 bukan pengganti HMAC, tandatangan digital, atau penghashan kata laluan. Gunakannya untuk aliran kerja jadual hash berkunci dan checksum, bukan untuk membuktikan ketulenan merentas sistem yang memerlukan jaminan keselamatan kriptografi.
