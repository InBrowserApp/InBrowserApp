## Membuka arkib web WARC

Pilih atau seret dan lepaskan fail `.warc` atau `.warc.gz`, atau cuba arkib contoh. Pemapar menyenaraikan rekod tangkapan dan membuka halaman HTML pertama yang ditemui dalam arkib. Tapis mengikut URL atau jenis rekod untuk mencari tangkapan, kemudian beralih antara pratonton halaman dengan butiran rekod. Pengindeksan arkib besar mungkin mengambil masa. Fail kekal dalam pelayar anda.

## Membaca tarikh tangkapan dan pengepala

Fail Web ARChive (WARC) menyimpan rekod yang dikumpulkan oleh perangkak web atau alat pengarkiban ketika melawat laman web. Beberapa rekod boleh berkongsi URL yang sama. Gunakan masa tangkapan dalam UTC dan status HTTP asal untuk membezakannya. Rekod respons (`response`) mengandungi jawapan pelayan, manakala rekod permintaan (`request`) menerangkan perkara yang dihantar oleh perangkak. Rekod lawatan semula (`revisit`) boleh merujuk kepada tangkapan lain tanpa menyimpan halaman itu sekali lagi. Anda boleh menyemak rekod ini walaupun pratonton halaman tiada.

## Apakah yang dipaparkan dalam pratonton?

Pratonton statik menggunakan HTML serta imej dan helaian gaya yang disokong daripada arkib yang sama. Sumber yang tiada boleh mengubah susun atur atau menyebabkan sebahagian halaman kelihatan kosong. Skrip dinyahdayakan dan pratonton tidak menghantar permintaan ke laman asal. Ciri interaktif seperti log masuk dan main balik video tidak tersedia. Pemapar menyokong WARC 1.0 dan 1.1, termasuk rekod yang dimampatkan dengan gzip.

[Spesifikasi format WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
