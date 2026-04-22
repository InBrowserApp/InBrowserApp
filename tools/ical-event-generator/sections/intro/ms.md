# Cipta fail kalendar tanpa meninggalkan pelayar

Alat ini menjana fail acara `.ics` standard terus di dalam pelayar anda. Anda boleh mentakrifkan acara bertetapan masa atau sepanjang hari, memilih strategi zon masa, menambah peringatan, dan mengeksport entri kalendar akhir tanpa menyegerakkan data ke pelayan.

## Mengapa menggunakannya

- Ia sesuai apabila anda hanya memerlukan fail kalendar dan bukan aliran akaun kalendar yang lengkap.
- Ia mengekalkan jadual sensitif secara setempat sambil masih menghasilkan lampiran acara berasaskan standard.
- Ia membolehkan anda melaras peraturan ulangan dan peringatan sebelum memuat turun fail `.ics` akhir.

## Aliran kerja yang disyorkan

1. Isi ringkasan acara, lokasi, nota dan URL rujukan pilihan.
2. Pilih julat acara, kemudian tentukan sama ada mahu mengeksport cap masa `UTC` atau mengekalkan zon masa asal dengan `TZID`.
3. Tambah peraturan ulangan dan peringatan hanya apabila diperlukan, kemudian muat turun fail dan lampirkannya di tempat anda berkongsi acara.

## Nota

- Output `UTC` biasanya pilihan paling selamat jika anda mahukan keserasian kalendar yang luas.
- Output `TZID` mengekalkan konteks penjadualan asal untuk klien yang memahami zon masa bernama.
- Untuk acara sepanjang hari, borang mengekalkan tarikh tamat sebagai inklusif, walaupun fail ICS menyimpannya sebagai tarikh tamat eksklusif.
