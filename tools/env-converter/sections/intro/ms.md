## Tukar konfigurasi persekitaran

Tampal fail `.env` dan pilih JSON atau YAML, atau tukar objek JSON/YAML rata kembali kepada `.env`. Import fail setempat, tukar tempat input dan output, serta salin atau muat turun hasilnya. Semuanya berjalan dalam pelayar anda; konfigurasi tidak pernah dimuat naik atau disimpan dalam sejarah pelayar atau storan setempat.

### Nilai dan tanda petik

Pemboleh ubah persekitaran ialah rentetan: `PORT=3000`, `DEBUG=false` dan `CODE=0012` kekal sebagai `"3000"`, `"false"` dan `"0012"`. Nombor dan boolean JSON/YAML ditukar kepada rentetan. Null, tatasusunan dan objek bersarang memerlukan nilai rentetan yang jelas. Letakkan nilai YAML seperti `0012` dalam tanda petik apabila ejaan tepatnya penting.

Penghurai menyokong baris kosong, komen `#`, awalan `export`, serta tanda petik tunggal, berganda atau terbalik dengan nilai berbilang baris. Hanya jujukan `\n` dan `\r` dalam tanda petik berganda dikembangkan. Tanda petik dan garis miring terbalik yang lain kekal secara literal, mengikut tingkah laku dotenv yang lazim. Kunci menggunakan huruf, digit dan garis bawah serta tidak boleh bermula dengan digit. Output memilih gaya tanda petik yang mengekalkan nilai.

### Semakan konfigurasi

Kunci `.env` pendua memaparkan nombor barisnya; takrifan terakhir digunakan. Tanda petik penutup yang tiada, teks selepas tanda petik penutup dan penetapan yang tidak sah memaparkan ralat dengan pautan ke baris yang terjejas. Tanda petik melengkung menghasilkan amaran. Kunci pendua JSON/YAML dianggap sebagai ralat.

Komen, gaya tanda petik asal dan pemformatan tidak dikekalkan. Rujukan seperti `${NAME}` dan arahan shell kekal secara literal dan tidak pernah dilaksanakan. Pemuat `.env` yang berbeza mempunyai peraturan yang berbeza; alat ini mengikut subset yang didokumenkan dan tidak mentafsir skrip shell.

Lihat [spesifikasi .env Node.js](https://nodejs.org/api/environment_variables.html#dotenv) dan [peraturan penghurai dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
