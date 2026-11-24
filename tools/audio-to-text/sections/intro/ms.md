## Cara menukar rakaman audio kepada teks

Seret dan lepaskan rakaman mesyuarat, temu bual, kuliah, podcast atau nota suara ke alat ini. Biarkan pengesanan bahasa automatik dihidupkan atau pilih bahasa pertuturan jika anda mengetahuinya. Pilih model transkripsi dan tekan **Mulakan transkripsi**. Apabila transkrip siap, pilih cap masa untuk mendengar bahagian rakaman tersebut. Anda boleh membetulkan nama, tanda baca atau perkataan yang tersalah cam sebelum menyalin atau memuat turun teks.

Alat ini membaca format audio yang boleh dinyahkod oleh pelayar anda, termasuk MP3, WAV, M4A, FLAC, OGG dan WebM. Sokongan codec berbeza mengikut pelayar. Jika fail tidak boleh dibuka, cuba eksport rakaman daripada aplikasi perakam sebagai WAV atau MP3.

## Model transkripsi manakah yang patut dipilih?

Gunakan **Whisper Base** untuk rakaman yang jelas atau draf awal. **Whisper Small** membantu dengan perbualan dan loghat. **Whisper Large V3 Turbo** sesuai untuk rakaman bising atau sukar difahami, tetapi memerlukan muat turun yang lebih besar dan lebih banyak memori. Model Whisper menyalin pelbagai bahasa dalam bahasa asal. **SenseVoiceSmall** menyokong bahasa Mandarin, Kantonis, Inggeris, Jepun dan Korea. **Qwen3-ASR 0.6B** menyediakan teks biasa atau penjajaran cap masa untuk main balik dan sari kata; penjajaran memuat turun model tambahan. Transkrip biasa boleh dieksport sebagai TXT. Pengecaman Qwen menggunakan WebGPU jika tersedia dan beralih kepada CPU jika tidak; penjajaran cap masa berjalan pada CPU.

Whisper menggunakan WebGPU jika pelayar dan perkakasan grafik menyokongnya. Model yang dipilih dimuat turun pada penggunaan pertama. Pelayar boleh menggunakan semula fail model yang tersimpan dalam cache. Saiz muat turun dan masa pemprosesan bergantung pada model dan peranti. Rakaman dinyahkod dan ditranskripsikan pada peranti anda. Rakaman audio tidak dihantar semasa model dimuat turun. SenseVoiceSmall berjalan secara setempat pada CPU melalui WebAssembly. Jika WebGPU tidak tersedia, Whisper beralih kepada CPU melalui WebAssembly.

## Eksport transkrip dengan cap masa atau sari kata

- **TXT** memaparkan masa mula bagi setiap petikan. Contoh `[00:02:15.320] Mari kita semak agenda.` menunjukkan ujaran yang bermula selepas lebih daripada dua minit rakaman. Format ini sesuai untuk nota mesyuarat, petikan temu bual atau carian dalam teks.
- **SRT (SubRip)** menyertakan masa mula dan tamat bagi setiap sari kata bernombor. Ini ialah format yang biasa digunakan dalam penyunting video.
- **VTT (WebVTT)** turut menyertakan masa mula dan tamat setiap sari kata. Format ini boleh digunakan dalam pemain video HTML yang menyokong trek sari kata.

Alat ini menganggarkan masa mula dan tamat setiap petikan. Dengar semula petikan penting dan semak masa sari kata sebelum berkongsi. Bunyi latar dan suara yang bertindih boleh menjejaskan hasilnya. Transkrip disusun dalam bahagian mengikut masa.
