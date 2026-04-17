## Apakah itu nombor VAT EU?

Nombor pengenalan VAT dikeluarkan oleh negara anggota EU kepada perniagaan yang berdaftar untuk Cukai Nilai Ditambah (Value Added Tax). Ia bermula dengan kod negara dua huruf (contohnya, `BE` untuk Belgium atau `EL` untuk Greece), diikuti dengan urutan digit dan kadangkala huruf khusus negara. Pihak berkuasa cukai menggunakannya untuk menjejaki perdagangan rentas sempadan dan tuntutan bayaran balik, jadi kesilapan pada invois, kontrak, atau rekod perolehan boleh menyekat pembayaran atau mencetuskan audit dengan mudah.

## Apa yang sebenarnya disemak oleh alat ini

Penyemak ini menjalankan tiga pengesahan bebas, semuanya dalam pelayar anda:

1. **Kod negara** — dua huruf di hadapan mestilah sepadan dengan negara anggota EU yang menyertai skim VAT (termasuk kod khas `EL` yang digunakan untuk Greece).
2. **Format** — aksara yang tinggal mestilah sepadan dengan format VAT yang didokumenkan oleh negara tersebut. Contohnya, VAT Belgium adalah tepat sepuluh digit, VAT Austria bermula dengan `U` diikuti dengan lapan digit, dan VAT Belanda mempunyai bentuk `<sembilan digit>B<dua digit>`.
3. **Checksum** — di mana checksum deterministik wujud dalam peraturan VAT negara (Austria, Belgium, Denmark, Finland, Perancis, Jerman, Itali, Belanda, Poland, Portugal, Sepanyol, Sweden), digit atau huruf terakhir dikira semula dan dibandingkan.

Nombor yang lulus ketiga-tiganya adalah berstruktur sintaksis yang baik. Itu tidak sama dengan mengesahkan bahawa perniagaan tersebut sedang berdaftar — untuk itu anda masih memerlukan perkhidmatan VIES Suruhanjaya Eropah atau pihak berkuasa cukai tempatan. Alat ini paling sesuai digunakan sebelum semakan akhir itu, untuk menangkap kesilapan taip, digit yang bertukar tempat, dan kesilapan salin-tampal yang menyebabkan pertanyaan VIES gagal atas sebab yang salah.

## Perkara biasa yang ia tangkap

- Nombor yang kelihatan betul pada pandangan sekilas tetapi kurang satu negara (contohnya, bermula dengan `US` atau `UK`).
- Sifar di hadapan yang dipangkas oleh hamparan, menghasilkan nombor yang kurang satu digit.
- Ruang, titik, atau sengkang yang ditampal oleh sistem invois — alat ini menormalkannya dan menyemak hasilnya.
- Kekeliruan klasik antara `GR` Greek dan VAT `EL`, yang segera ditolak oleh semakan format.

## Apa yang dipaparkan oleh kad keputusan

Selain lencana sah/tidak sah yang mudah, keputusan memecahkan negara, nombor yang dinormalkan, format yang dijangkakan oleh negara, dan sama ada checksum lulus, gagal, atau dilangkau kerana negara tidak menerbitkannya. Butiran itu berguna apabila anda perlu menerangkan penolakan — "format tidak mengapa, checksum tidak sepadan" adalah lebih berguna daripada sekadar "tidak sah."

## Privasi

Setiap semakan berjalan secara tempatan dalam pelayar anda. Tiada apa yang dihantar ke pelayan, dilog, atau disimpan di mana-mana kecuali localStorage pelayar anda sendiri (untuk input terakhir yang anda taip, supaya ia kekal selepas muat semula halaman). Anda boleh menampal nombor VAT pelanggan tanpa risau tentang ke mana ia berakhir.
