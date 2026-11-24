## Eksport acara kalendar ICS kepada CSV

Pilih **ICS kepada CSV**, buka fail iCalendar atau tampal kandungannya, kemudian pilih **Tukar**. Hamparan mengandungi satu baris bagi setiap rekod acara, termasuk tajuk, waktu mula, waktu tamat, lokasi, penerangan dan peraturan ulangan jika ada. Muat turun CSV untuk menyemak atau menyuntingnya dalam Excel atau Google Sheets. Acara sepanjang hari menggunakan tarikh tanpa waktu dan tarikh tamat tidak dikira sebagai sebahagian daripada acara. Sebagai contoh, acara yang berlangsung sepanjang 12 Mei mempunyai tarikh tamat 13 Mei.

## Cipta fail ICS daripada baris CSV

Pilih **CSV kepada ICS**, kemudian pilih **Cuba contoh** untuk melihat tajuk lajur. Sertakan sekurang-kurangnya lajur `Title` dan `Start`. Gunakan `2026-05-12` untuk acara sepanjang hari, `2026-05-12T09:00:00` untuk waktu tempatan atau `2026-05-12T09:00:00Z` untuk UTC. Alat ini turut mengenal pasti tajuk lajur Google Calendar seperti `Subject`, `Start Date`, `Start Time` dan `All Day Event`. Muat turun fail ICS untuk mengimport acara ke dalam kalendar anda.

## Simpan kalendar asal sebagai sandaran lengkap

CSV menyimpan butiran acara dalam baris. Siri acara berulang disimpan sebagai peraturan ulangan tanpa menjana setiap tarikh. Takrif zon masa yang dibenamkan akan dikekalkan. Lampiran, peringatan, peserta, pengecualian ulangan dan status pembatalan kekal dalam kalendar asal. Penukaran dilakukan dalam pelayar anda.
