## Pisahkan kanal kiri dan kanan audio stereo

Buka rekaman stereo untuk menyimpan kanal kiri dan kanan sebagai dua file mono terpisah. Alat ini berguna jika Anda merekam dua mikrofon pada kanal berbeda dalam satu file, perlu memeriksa derau di salah satu sisi, atau ingin mengedit masing-masing kanal di editor audio.

## Cara memisahkan kanal dalam file stereo

1. Pilih file audio stereo atau seret dan lepas file ke alat ini. Kedua kanal akan dipisahkan secara otomatis.
2. Gunakan pemutar di bawah setiap label kanal untuk mendengarkan rekaman dari sisi tersebut.
3. Pilih satu format unduhan untuk kedua kanal, lalu simpan satu kanal atau keduanya. Jika WAV dipilih, `interview.wav` akan menghasilkan `interview-left.wav` dan `interview-right.wav`.

Setiap file berisi satu kanal sepanjang rekaman asli. Jika kedua file diletakkan pada titik awal yang sama di editor audio, keduanya tetap sinkron. Saat diputar, pratinjau mono tiap kanal terdengar dari tengah. Lihat label di atas pemutar untuk mengetahui kanal asalnya.

## Format audio apa yang sebaiknya dipilih?

- **WAV** adalah format bawaan dan cocok untuk pengeditan. Untuk rekaman PCM yang didukung, WAV mempertahankan laju sampel dan presisi sumber.
- **FLAC** mengompresi sampel tanpa kehilangan data sehingga ukuran file lebih kecil. Pilih WAV ketika pengode FLAC tidak dapat mempertahankan laju sampel atau presisi rekaman, misalnya pada WAV bertipe floating-point.
- **MP3** menghasilkan file yang lebih kecil untuk dibagikan. Mengekspor ke MP3 menerapkan kompresi dengan kehilangan data, termasuk saat rekaman asal sudah berformat MP3. Jika MP3 tidak mendukung laju sampel asli, alat ini menggunakan laju sampel terdekat yang didukung. Pilih WAV atau FLAC agar audio tidak melalui satu tahap kompresi tersebut lagi.

Format input stereo yang umum mencakup WAV, MP3, M4A, FLAC, dan OGG. Dukungannya bergantung pada browser dan codec di dalam file. Jika file tidak dapat dibuka, coba ekspor sebagai WAV stereo lalu buka salinannya. Browser membaca file dan menyiapkan hasil unduhan langsung di perangkat Anda.

## Apa yang bisa dipisahkan dari audio stereo?

File stereo menyimpan dua kanal. Saat kanal dipisahkan, audio dari tiap kanal disimpan ke file tersendiri. Jika stereo dicampur menjadi mono, kedua kanal digabung ke satu file. Suara dan instrumen yang sudah tercampur dalam satu kanal tetap bersama di hasil ekspor. Rekaman mono hanya memiliki satu kanal. Untuk rekaman surround, gunakan editor audio untuk mengekspor pasangan kanal stereo yang diinginkan terlebih dahulu.
