# Pembuat Kunci PGP

Gunakan alat ini untuk membuat pasangan kunci OpenPGP langsung di browser Anda. Alat ini menghasilkan kunci publik armored, kunci privat, sertifikat pencabutan, ID kunci, dan sidik jari sehingga Anda dapat menyiapkan email terenkripsi, enkripsi file, penandatanganan rilis, atau alur kerja pemulihan akun tanpa mengirim materi kunci ke server.

## Kapan menggunakannya

Kunci PGP berguna saat Anda membutuhkan kriptografi asimetris: orang lain menggunakan kunci publik Anda untuk mengenkripsi data bagi Anda atau memverifikasi tanda tangan, sementara kunci privat Anda mendekripsi data dan membuat tanda tangan. Pembuat berbasis browser praktis untuk sesi penyiapan singkat, demo, atau alur kerja lokal saat Anda ingin mendapatkan hasilnya segera.

## Cara membuat pasangan kunci

Masukkan nama, email, atau keduanya agar kunci memiliki ID pengguna yang mudah dikenali. Tambahkan komentar opsional jika Anda ingin memisahkan kunci untuk pekerjaan, proyek, atau penandatanganan rilis. Pilih ECC untuk perangkat lunak OpenPGP modern, atau RSA saat Anda membutuhkan kompatibilitas dengan alat yang lebih lama. Frasa sandi bersifat opsional, tetapi sangat disarankan untuk setiap kunci privat yang ingin Anda simpan.

## Jenis kunci dan kedaluwarsa

ECC menggunakan Curve25519 dan menjadi bawaan karena ringkas dan cepat. RSA tersedia dalam 2048, 3072, dan 4096 bit untuk kompatibilitas. Kedaluwarsa diatur dalam hari; gunakan 0 hanya untuk kunci yang Anda kelola secara aktif dan dapat Anda cabut. Periode kedaluwarsa yang lebih singkat mengurangi risiko jangka panjang dan memudahkan kebiasaan rotasi.

## Menangani kunci privat dengan aman

Unduh kunci publik, kunci privat, dan sertifikat pencabutan sebagai file terpisah. Cadangkan kunci privat di pengelola kata sandi terenkripsi atau penyimpanan offline yang aman, dan simpan sertifikat pencabutan di tempat terpisah agar Anda dapat menghentikan kunci jika kunci privat hilang atau terekspos. Sebelum menerbitkan kunci publik, bandingkan sidik jari melalui saluran tepercaya.
