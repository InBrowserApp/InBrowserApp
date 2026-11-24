## Ekspor acara kalender ICS ke CSV

Pilih **ICS ke CSV**, buka atau tempel isi file iCalendar, lalu pilih **Konversi**. Spreadsheet berisi satu baris per entri acara, termasuk judul, waktu mulai dan selesai, lokasi, deskripsi, serta aturan pengulangan jika ada. Unduh CSV untuk melihat atau mengeditnya di Excel atau Google Sheets. Untuk acara sepanjang hari, nilainya berupa tanggal dan tanggal akhir tidak termasuk dalam durasi acara. Sebagai contoh, acara sepanjang 12 Mei memiliki tanggal akhir 13 Mei.

## Buat file ICS dari baris CSV

Pilih **CSV ke ICS**, lalu pilih **Coba contoh** untuk melihat judul kolomnya. Sertakan setidaknya kolom `Title` dan `Start`. Gunakan `2026-05-12` untuk acara sepanjang hari, `2026-05-12T09:00:00` untuk waktu setempat, atau `2026-05-12T09:00:00Z` untuk UTC. Alat ini juga mengenali judul kolom Google Calendar seperti `Subject`, `Start Date`, `Start Time`, dan `All Day Event`. Unduh file ICS untuk mengimpor acara ke kalender Anda.

## Simpan kalender asli sebagai cadangan lengkap

CSV menyimpan detail acara dalam baris. Rangkaian acara berulang disimpan sebagai aturan pengulangan tanpa membuat entri terpisah untuk setiap tanggal. Definisi zona waktu yang disematkan tetap dipertahankan. Lampiran, pengingat, peserta, kejadian yang dikecualikan dari pengulangan, dan status pembatalan tetap tersimpan di kalender asli. Konversi berjalan di browser Anda.
