## Cara menghubungkan keyboard atau pengontrol MIDI

Hubungkan perangkat MIDI dan pastikan sistem operasi mengenalinya. Pilih **Aktifkan MIDI**, berikan izin MIDI pada browser jika diminta, lalu pilih input. Gunakan browser yang kompatibel melalui HTTPS. Monitor mendengarkan input yang dipilih dan menampilkan pesan secara lokal.

## Cara menguji not dan velocity

Tekan tuts atau pad dan amati piano serta log pesan. Note On menampilkan not dan velocity-nya, biasanya bernilai 1 hingga 127. Note Off atau Note On dengan velocity 0 melepaskan not. Keyboard memberi label C4 pada not MIDI 60. Ubah oktaf awal untuk melihat rentang lain. Not yang ditahan tetap tercantum meskipun berada di luar rentang yang ditampilkan.

## Cara memeriksa CC, pitch bend, dan MIDI Clock

Gerakkan kenop, fader, atau pedal untuk melihat nomor dan nilai Control Change (CC). Misalnya, banyak pedal sustain mengirim CC 64. Pitch Bend ditampilkan dengan nilai tengah 0. Pulsa MIDI Clock dihitung terpisah dari log pesan. MIDI Clock standar mengirim 24 pulsa per not seperempat. Log menyertakan nomor kanal dan byte heksadesimal mentah untuk memeriksa setiap pesan.

## Mengapa input MIDI saya tidak merespons?

Periksa kabel, daya, dan mode perangkat, lalu pastikan port yang dipilih sesuai dengan pengontrol. Tutup aplikasi lain yang mungkin menggunakan input tersebut, lalu hubungkan kembali. Dukungan bergantung pada browser dan sistem operasi. Alat ini mendengarkan pesan MIDI standar dengan akses MIDI biasa. Pesan System Exclusive (SysEx) khusus perangkat memerlukan izin tambahan.
