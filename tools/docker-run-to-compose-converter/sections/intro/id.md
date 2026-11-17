## Fungsi Alat Ini

Pengonversi Docker Run ke Compose mengonversi satu atau beberapa perintah `docker run` menjadi
file `docker-compose.yml` di browser. Anda dapat memeriksa YAML yang dihasilkan,
menyalin, atau mengunduhnya sebelum memasukkannya ke dalam proyek Anda.

## Kapan Menggunakannya

Gunakan alat ini saat Anda ingin mengubah perintah kontainer ad hoc menjadi definisi
layanan Compose yang dapat digunakan berulang kali, atau saat ingin melihat pemetaan port,
volume, variabel lingkungan, dan flag sumber daya ke Compose.

## Hasil yang Dapat Diharapkan

Opsi umum seperti port, variabel lingkungan, kebijakan mulai ulang,
pemeriksaan kesehatan, mount, dan batas sumber daya dipertahankan. Flag yang tidak didukung atau
ambigu ditampilkan sebagai peringatan agar Anda dapat memeriksa keluaran sebelum
menggunakannya.
