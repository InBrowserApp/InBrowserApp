## Ubah MIDI menjadi partitur yang dapat disunting

Pilih file .mid atau .midi, tentukan grid kuantisasi, lalu pilih **Unduh MusicXML**. Buka partitur di program notasi seperti MuseScore Studio, Dorico, atau Sibelius untuk menyunting atau mencetaknya. Anda juga dapat membuka hasilnya di [Penampil MusicXML](/id/tools/musicxml-viewer/) untuk memeriksanya di browser.

## Pilih grid ritme

MIDI merekam waktu setiap not. Saat dimainkan, not bisa jatuh sedikit lebih awal atau lebih lambat dari ketukan. Kuantisasi menggeser awal dan akhir not ke titik terdekat pada grid agar ritmenya dapat ditulis. Mulailah dengan not seperenam belas (1/16). Coba not seperdelapan (1/8) untuk melodi yang lebih sederhana atau not sepertiga puluh dua (1/32) agar not pendek tetap terpisah.

## Isi partitur hasil konversi

Konverter menulis MusicXML partwise dari MIDI dengan pengaturan waktu berbasis ketukan (format 0 atau 1). Konverter mengelompokkan data menurut bagian dan menggabungkan not yang berbunyi bersamaan, serta mempertahankan tempo, tanda birama, dan tanda mula. Not drum General MIDI ditulis sebagai perkusi tanpa tinggi nada tertentu. Konverter mengandalkan not dan waktu dari MIDI. Periksa kembali detail seperti birama awal yang tidak lengkap (anakrusis), tuplet, penjarian, dan penulisan not enharmonik di program notasi Anda. File diproses secara lokal di browser.
