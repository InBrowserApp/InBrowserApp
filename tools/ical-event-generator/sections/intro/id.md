## Buat file kalender tanpa keluar dari browser

Alat ini menghasilkan file acara `.ics` standar langsung di browser Anda. Anda dapat menentukan acara berwaktu atau sepanjang hari, memilih strategi zona waktu, menambahkan pengingat, dan mengekspor entri kalender akhir tanpa menyinkronkan data ke server.

### Mengapa menggunakannya

- Cocok ketika Anda hanya memerlukan file kalender, bukan alur akun kalender yang lengkap.
- Menjaga jadwal sensitif tetap lokal sambil tetap menghasilkan lampiran acara yang sesuai standar.
- Memungkinkan Anda menyesuaikan aturan pengulangan dan pengingat sebelum mengunduh file `.ics` akhir.

### Alur yang disarankan

1. Isi ringkasan acara, lokasi, catatan, dan URL referensi opsional.
2. Pilih rentang acara, lalu tentukan apakah akan mengekspor stempel waktu `UTC` atau mempertahankan zona waktu asli dengan `TZID`.
3. Tambahkan aturan pengulangan dan pengingat hanya bila perlu, lalu unduh file dan lampirkan di tempat Anda membagikan acara.

### Catatan

- Output `UTC` biasanya merupakan pilihan paling aman jika Anda menginginkan kompatibilitas kalender yang luas.
- Output `TZID` mempertahankan konteks penjadwalan asli untuk klien yang memahami zona waktu bernama.
- Untuk acara sepanjang hari, formulir mempertahankan tanggal akhir sebagai inklusif, walaupun file ICS menyimpannya sebagai tanggal akhir eksklusif.
