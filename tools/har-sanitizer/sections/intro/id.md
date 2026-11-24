## Cara membersihkan file HAR

File HAR (HTTP Archive) merekam permintaan dan respons jaringan dari browser. File ini dapat memuat cookie sesi, token otorisasi, URL, dan isi yang mengandung informasi pribadi. Gunakan alat ini untuk membuat salinan yang telah dibersihkan untuk tiket dukungan, laporan bug, atau rekan satu tim. Metode, kode status, dan rincian waktu setiap permintaan tetap tersimpan.

1. Buka alat pengembang di browser dan pilih panel **Jaringan** (Network). Ulangi langkah yang memicu masalah, lalu ekspor log sebagai file HAR. Di Chrome, pilih **Export HAR (sanitized)** untuk membuat salinan dengan header kredensial standar yang sudah dihapus.
2. Buka atau seret file HAR hasil ekspor ke sini. Alat ini langsung menyiapkan salinan saat Anda memilih file. Coba file contoh untuk melihat data yang berubah.
3. Periksa jumlahnya, lalu pilih **Unduh HAR yang sudah dibersihkan**. File baru berakhiran `.sanitized.har` dan dapat diimpor ke DevTools atau [Penganalisis Jaringan HAR](/id/tools/har-analyzer/). Pemrosesan berlangsung di browser Anda.

## Data apa yang dihapus atau disamarkan?

Alat ini menghapus cookie dan header autentikasi yang umum, termasuk `Authorization` dan `X-API-Key`. Secara bawaan, alat ini menyamarkan nilai parameter URL serta menghapus isi permintaan, respons, dan pesan WebSocket yang terekam. Misalnya, `?token=example&page=2` menjadi `?token=REDACTED&page=REDACTED` pada file hasil ekspor. Nama parameter tetap tersedia untuk menelusuri masalah. Setiap kolom yang berubah dihitung, termasuk ketika nilai yang sama muncul di beberapa kolom.

Nonaktifkan opsi terkait jika Anda memerlukan nilai parameter atau isi asli untuk mereproduksi masalah. Nama host, jalur URL, header lain, dan metadata khusus browser masih bisa mengandung informasi pribadi. Periksa kolom-kolom tersebut sebelum membagikan file.
