## Cara mengubah rekaman audio menjadi teks

Seret dan letakkan rekaman rapat, wawancara, kuliah, podcast, atau catatan suara di alat ini. Gunakan deteksi bahasa otomatis atau pilih bahasa yang digunakan dalam rekaman jika sudah mengetahuinya. Pilih model Whisper lalu klik **Mulai transkripsi**. Setelah transkrip siap, pilih penanda waktu untuk mendengarkan bagian rekaman tersebut. Anda bisa memperbaiki nama, tanda baca, atau kata yang keliru dikenali sebelum menyalin atau mengunduh teks.

Alat ini membaca format audio yang bisa didekode oleh browser Anda, termasuk MP3, WAV, M4A, FLAC, OGG, dan WebM. Dukungan codec berbeda antarbrowser. Jika file gagal dibuka, coba ekspor ulang rekaman dari aplikasi perekam sebagai WAV atau MP3.

## Model transkripsi mana yang sebaiknya dipilih?

Mulai dengan **Cepat (Whisper Base)** untuk catatan suara yang jernih atau untuk membuat draf awal. **Seimbang (Whisper Small)** bisa membantu mengenali percakapan dan beragam aksen. **Akurasi tertinggi (Whisper Large V3 Turbo)** adalah pilihan terbaik di sini untuk audio yang sulit dipahami. Ukuran unduhannya lebih besar dan penggunaan memorinya lebih tinggi. Ketiga model mendukung berbagai bahasa dan menuliskan ucapan dalam bahasa aslinya.

Whisper menggunakan WebGPU jika browser dan perangkat grafis mendukungnya. Alat ini juga dapat berjalan di CPU melalui WebAssembly. Model pilihan Anda diunduh saat pertama kali digunakan. Browser dapat menggunakan kembali file model yang tersimpan di cache. Ukuran unduhan dan lama pemrosesan bergantung pada model dan perangkat. Rekaman didekode dan ditranskripsikan di perangkat Anda. Audio tidak dikirim saat model diunduh.

## Mengekspor transkrip dengan penanda waktu atau subtitel

- **TXT** mencantumkan waktu mulai setiap potongan teks. Contoh `[00:02:15.320] Mari kita bahas agendanya.` menunjuk ke ucapan sedikit lewat dua menit dalam rekaman. Gunakan format ini untuk catatan rapat, kutipan wawancara, atau teks yang bisa ditelusuri.
- **SRT (SubRip)** menambahkan waktu mulai dan selesai untuk setiap subtitel bernomor. Format ini umum digunakan di editor video.
- **VTT (WebVTT)** juga menyertakan waktu mulai dan selesai setiap subtitel. Format ini dapat digunakan pada pemutar video HTML yang mendukung trek subtitel.

Whisper memperkirakan waktu mulai dan selesai setiap potongan teks. Dengarkan kembali kutipan penting dan tinjau kesesuaian waktu subtitel sebelum membagikannya. Suara latar dan percakapan yang saling tumpang tindih bisa memengaruhi hasil. Teks disusun per bagian berdasarkan waktunya.
