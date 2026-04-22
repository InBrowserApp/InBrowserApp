## Apakah Basic Auth?

Basic Auth meletakkan `username:password` dalam pengepala `Authorization` selepas ia dikodkan dengan Base64. Ia mudah dan disokong secara meluas, tetapi Base64 hanyalah pengekodan, bukannya penyulitan.

## Apa yang dijana oleh alat ini

- Pengepala `Authorization: Basic ...` yang boleh anda tampal ke dalam klien API.
- Contoh `curl` yang sedia dijalankan untuk ujian pantas.
- Semuanya berjalan secara setempat di dalam pelayar.

## Perkara yang perlu diingat

- Sentiasa gunakan HTTPS apabila menghantar kelayakan Basic Auth.
- Sesiapa yang melihat pengepala itu boleh menyahkod nama pengguna dan kata laluan asal.
- Basic Auth sesuai untuk alat dalaman, persekitaran staging dan semakan API pantas.
