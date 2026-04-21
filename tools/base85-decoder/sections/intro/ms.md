## Mengapa penyahkodan Base85 penting

Base85 muncul apabila data binari perlu melalui sistem teks sahaja dengan overhed yang lebih rendah berbanding perenambelasan atau Base64. Anda mungkin menemuinya dalam aliran PostScript atau PDF, muatan Z85 ZeroMQ, tangkapan nyahpepijat, eksport arkib dan alat yang memerlukan aksara boleh cetak bukannya bait binari mentah.

## Apa yang dibantu oleh penyahkod ini

Alat ini menukar teks ASCII85 atau Z85 kembali kepada bait asal terus di pelayar. Anda boleh menampal data yang telah dikodkan, mengimport fail, menukar abjad supaya sepadan dengan sistem sumber, melihat pratonton hasil penyahkodan, dan memuat turun binari yang dipulihkan tanpa menghantar apa-apa ke pelayan.

## Perkara yang perlu diingat

- ASCII85 dan Z85 tidak boleh saling menggantikan. Memilih abjad yang salah biasanya menyebabkan ralat penyahkodan atau output yang rosak.
- Base85 ialah format pengekodan, bukannya penyulitan. Hasil yang dinyahkod boleh berupa teks biasa, kandungan termampat atau data binari arbitrari.
- Z85 memerlukan kumpulan lengkap 5 aksara, manakala ASCII85 juga boleh mengandungi pemisah dan singkatan seperti `z` untuk blok sifar.
