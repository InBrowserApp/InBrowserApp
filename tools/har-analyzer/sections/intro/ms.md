## Buka rakaman HAR

Eksport fail HAR (HTTP Archive) daripada panel Rangkaian pelayar anda selepas merakam permintaan yang ingin disiasat. Buka atau lepaskan fail `.har` atau `.json` di sini, atau muatkan contoh. Had fail ialah 20 MiB dan 20,000 entri.

## Cari permintaan lambat atau gagal

Cari mengikut URL, kaedah, status atau jenis MIME, kemudian isih mengikut masa mula, tempoh atau saiz pindahan. Permintaan berkongsi satu skala masa, dikira dari permintaan terawal. Pilih satu untuk memeriksa pengepala, kuki, parameter, badan dan fasa pemasaan.

Penapis gagal merangkumi status 0, 4xx dan 5xx. Status 0 bermaksud tiada respons HTTP direkodkan; penapis 3xx merangkumi respons cache 304. TLS termasuk dalam masa sambungan.

## Baca data yang direkodkan

Pemprosesan dilakukan dalam pelayar anda. Butiran yang tersedia bergantung pada eksport. Saiz yang tidak diketahui dikecualikan daripada jumlah; tempoh rakaman tidak tersedia apabila tempoh sesuatu permintaan tiada. Carta air terjun masih menggunakan masa mula yang direkodkan dan waktu tamat yang diketahui.

Pratonton badan mengekalkan teks yang direkodkan. Pratonton dan salinannya, serta nilai medan individu, dihadkan kepada 100,000 aksara. Badan berkod kekal berkod.
