## Cara menyambungkan papan kekunci atau pengawal MIDI

Sambungkan peranti MIDI dan pastikan sistem pengendalian anda mengenalinya. Pilih **Aktifkan MIDI**, benarkan akses MIDI dalam pelayar jika diminta, dan pilih input. Gunakan pelayar yang serasi dan buka halaman melalui HTTPS. Monitor menerima mesej daripada input yang dipilih dan memaparkannya secara setempat.

## Cara menguji not dan halaju

Tekan kekunci atau pad dan perhatikan papan kekunci piano serta log mesej. Note On menunjukkan not dan halajunya, biasanya nilai dari 1 hingga 127. Note Off atau Note On dengan halaju 0 melepaskan not tersebut. Papan kekunci melabelkan not MIDI 60 sebagai C4. Tukar oktaf mula untuk melihat julat lain. Not yang ditahan tetap disenaraikan walaupun berada di luar julat yang dipaparkan.

## Cara memeriksa CC, pitch bend dan MIDI Clock

Gerakkan tombol, fader atau pedal untuk melihat nombor dan nilai Control Change (CC) masing-masing. Contohnya, banyak pedal sustain menghantar CC 64. Pitch bend dipaparkan dengan nilai tengah 0. Denyut MIDI Clock dikira secara berasingan daripada log mesej. MIDI Clock standard menghantar 24 denyut bagi setiap not suku. Log mengandungi nombor saluran dan bait heksadesimal mentah untuk memeriksa setiap mesej.

## Mengapa input MIDI saya tidak memberikan respons?

Periksa kabel, bekalan kuasa dan mod peranti, dan pastikan port yang dipilih sepadan dengan pengawal. Tutup aplikasi lain yang mungkin menggunakan input itu, kemudian sambungkannya semula. Sokongan bergantung pada pelayar dan sistem pengendalian. Alat ini menerima mesej MIDI standard dengan akses MIDI biasa. Mesej System Exclusive (SysEx) khusus peranti memerlukan kebenaran tambahan.
