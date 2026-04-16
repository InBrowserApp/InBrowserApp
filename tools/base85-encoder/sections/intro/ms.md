## Apakah itu Base85?

Base85 ialah pengekodan binari-ke-teks yang menukar 4 bait kepada 5 aksara boleh cetak. Ia lebih padat daripada Base64, dan alat ini membolehkan anda memilih ASCII85 atau Z85 mengikut format yang dijangka oleh penerima.

## Bila patut digunakan?

- Untuk mengekod bait mentah, teks atau fail bagi saluran berasaskan teks sambil mengekalkan output yang agak padat.
- Gunakan ASCII85 apabila anda memerlukan format Base85 yang fleksibel dan boleh mengendalikan bait baki di hujung data.
- Gunakan Z85 apabila anda memerlukan teks Base85 yang serasi dengan ZeroMQ dan panjang input ialah gandaan tepat 4 bait.

## Perkara yang perlu diingat

- Base85 ialah format pengekodan, bukannya penyulitan.
- ASCII85 dan Z85 menggunakan abjad yang berbeza, jadi ia tidak boleh saling menggantikan.
- Z85 menolak data yang panjang baitnya tidak boleh dibahagi dengan 4, manakala ASCII85 boleh mengekod blok hujung separa.
