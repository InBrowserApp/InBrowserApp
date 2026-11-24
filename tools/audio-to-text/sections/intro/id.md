## Cara mengubah rekaman audio menjadi teks

Seret dan letakkan rekaman rapat, wawancara, kuliah, podcast, atau catatan suara di alat ini. Gunakan deteksi bahasa otomatis atau pilih bahasa yang digunakan dalam rekaman jika sudah mengetahuinya. Pilih model transkripsi lalu klik **Mulai transkripsi**. Setelah transkrip siap, pilih penanda waktu untuk mendengarkan bagian rekaman tersebut. Anda bisa memperbaiki nama, tanda baca, atau kata yang keliru dikenali sebelum menyalin atau mengunduh teks.

Alat ini membaca format audio yang bisa didekode oleh browser Anda, termasuk MP3, WAV, M4A, FLAC, OGG, dan WebM. Dukungan codec berbeda antarbrowser. Jika file gagal dibuka, coba ekspor ulang rekaman dari aplikasi perekam sebagai WAV atau MP3.

## Model transkripsi mana yang sebaiknya dipilih?

Gunakan **Whisper Base** untuk rekaman yang jernih atau draf awal. **Whisper Small** membantu menangani percakapan dan aksen. **Whisper Large V3 Turbo** cocok untuk rekaman bising atau sulit dipahami, tetapi unduhannya lebih besar dan membutuhkan lebih banyak memori. Model Whisper mendukung berbagai bahasa dan menuliskan ucapan dalam bahasa aslinya. **SenseVoiceSmall** mendukung bahasa Mandarin, Kanton, Inggris, Jepang, dan Korea. **Qwen3-ASR 0.6B** menyediakan teks biasa atau penyelarasan waktu untuk pemutaran dan subtitel; penyelarasan mengunduh model tambahan. Transkrip biasa dapat diekspor sebagai TXT. Pengenalan Qwen menggunakan WebGPU jika tersedia dan beralih ke CPU jika tidak; penyelarasan waktu berjalan di CPU.

Whisper menggunakan WebGPU jika browser dan perangkat grafis mendukungnya. Model pilihan Anda diunduh saat pertama kali digunakan. Browser dapat menggunakan kembali file model yang tersimpan di cache. Ukuran unduhan dan lama pemrosesan bergantung pada model dan perangkat. Rekaman didekode dan ditranskripsikan di perangkat Anda. Audio tidak dikirim saat model diunduh. SenseVoiceSmall berjalan secara lokal di CPU melalui WebAssembly. Jika WebGPU tidak tersedia, Whisper beralih ke CPU melalui WebAssembly.

## Mengekspor transkrip dengan penanda waktu atau subtitel

- **TXT** mencantumkan waktu mulai setiap potongan teks. Contoh `[00:02:15.320] Mari kita bahas agendanya.` menunjuk ke ucapan sedikit lewat dua menit dalam rekaman. Gunakan format ini untuk catatan rapat, kutipan wawancara, atau teks yang bisa ditelusuri.
- **SRT (SubRip)** menambahkan waktu mulai dan selesai untuk setiap subtitel bernomor. Format ini umum digunakan di editor video.
- **VTT (WebVTT)** juga menyertakan waktu mulai dan selesai setiap subtitel. Format ini dapat digunakan pada pemutar video HTML yang mendukung trek subtitel.

Alat ini memperkirakan waktu mulai dan selesai setiap potongan teks. Dengarkan kembali kutipan penting dan tinjau kesesuaian waktu subtitel sebelum membagikannya. Suara latar dan percakapan yang saling tumpang tindih bisa memengaruhi hasil. Teks disusun per bagian berdasarkan waktunya.
