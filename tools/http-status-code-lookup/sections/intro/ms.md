## Apakah Kod Status HTTP?

Kod status HTTP ialah kod respons tiga digit yang dipulangkan oleh pelayan untuk menunjukkan apa yang berlaku kepada sesuatu permintaan. Anda akan kerap melihatnya dalam alat pembangun pelayar, respons API, log pelayan, semakan ketersediaan dan papan pemuka reverse proxy.

### Cara Membaca Keluarga Kod Status Utama

- **1xx Maklumat:** Pelayan telah menerima permintaan dan pemprosesan masih berjalan.
- **2xx Berjaya:** Permintaan telah diselesaikan dengan berjaya.
- **3xx Pengalihan:** Klien perlu mengikuti lokasi lain atau menggunakan semula hasil yang disimpan dalam cache.
- **4xx Ralat Klien:** Permintaan itu sendiri bermasalah, seperti sumber tidak ditemui, input tidak sah atau pengesahan gagal.
- **5xx Ralat Pelayan:** Pelayan atau kebergantungan upstream gagal semasa memproses permintaan yang sah.

### Bila lookup ini berguna

Gunakan alat ini apabila anda perlu mengesahkan maksud sesuatu kod, membandingkan kod yang hampir sama seperti 401 dan 403 atau 502 dan 504, atau mencari berdasarkan frasa daripada mesej ralat. Carian menyokong kod, nama status dan huraian setempat.

### Mengapa tafsiran yang betul penting

Semasa nyahpepijat, kod status sering menjadi petunjuk paling cepat. Respons 4xx biasanya menunjuk kepada permintaan, kelayakan atau sumber sasaran. Respons 5xx biasanya menunjuk kepada aplikasi, gerbang atau perkhidmatan upstream. Membaca kategorinya terlebih dahulu membantu anda memilih langkah seterusnya dengan lebih tepat.
