## Cara menukar rakaman audio kepada teks

Seret dan lepaskan rakaman mesyuarat, temu bual, kuliah, podcast atau nota suara ke alat ini. Biarkan pengesanan bahasa automatik dihidupkan atau pilih bahasa pertuturan jika anda mengetahuinya. Pilih model Whisper dan tekan **Mulakan transkripsi**. Apabila transkrip siap, pilih cap masa untuk mendengar bahagian rakaman tersebut. Anda boleh membetulkan nama, tanda baca atau perkataan yang tersalah cam sebelum menyalin atau memuat turun teks.

Alat ini membaca format audio yang boleh dinyahkod oleh pelayar anda, termasuk MP3, WAV, M4A, FLAC, OGG dan WebM. Sokongan codec berbeza mengikut pelayar. Jika fail tidak boleh dibuka, cuba eksport rakaman daripada aplikasi perakam sebagai WAV atau MP3.

## Model transkripsi manakah yang patut dipilih?

Mulakan dengan **Pantas (Whisper Base)** untuk nota suara yang jelas atau draf awal. **Seimbang (Whisper Small)** boleh membantu mengenal pertuturan dalam perbualan dan pelbagai loghat. **Paling tepat (Whisper Large V3 Turbo)** merupakan pilihan terbaik di sini untuk audio yang sukar difahami. Saiz muat turunnya lebih besar dan penggunaan memorinya lebih tinggi. Ketiga-tiga model boleh menyalin pertuturan dalam pelbagai bahasa mengikut bahasa asal rakaman.

Whisper menggunakan WebGPU jika pelayar dan perkakasan grafik menyokongnya. Alat ini juga boleh berfungsi pada CPU melalui WebAssembly. Model yang dipilih dimuat turun pada penggunaan pertama. Pelayar boleh menggunakan semula fail model yang tersimpan dalam cache. Saiz muat turun dan masa pemprosesan bergantung pada model dan peranti. Rakaman dinyahkod dan ditranskripsikan pada peranti anda. Rakaman audio tidak dihantar semasa model dimuat turun.

## Eksport transkrip dengan cap masa atau sari kata

- **TXT** memaparkan masa mula bagi setiap petikan. Contoh `[00:02:15.320] Mari kita semak agenda.` menunjukkan ujaran yang bermula selepas lebih daripada dua minit rakaman. Format ini sesuai untuk nota mesyuarat, petikan temu bual atau carian dalam teks.
- **SRT (SubRip)** menyertakan masa mula dan tamat bagi setiap sari kata bernombor. Ini ialah format yang biasa digunakan dalam penyunting video.
- **VTT (WebVTT)** turut menyertakan masa mula dan tamat setiap sari kata. Format ini boleh digunakan dalam pemain video HTML yang menyokong trek sari kata.

Whisper menganggarkan masa mula dan tamat setiap petikan. Dengar semula petikan penting dan semak masa sari kata sebelum berkongsi. Bunyi latar dan suara yang bertindih boleh menjejaskan hasilnya. Transkrip disusun dalam bahagian mengikut masa.
