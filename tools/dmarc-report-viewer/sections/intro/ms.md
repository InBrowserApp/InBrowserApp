## Cara membaca laporan agregat DMARC

Buka lampiran laporan agregat yang dihantar ke alamat `rua` dalam rekod DMARC anda. Pemapar menerima XML, GZIP dan fail ZIP yang mengandungi satu laporan XML. Anda juga boleh menampal XML atau memuatkan contoh. Ringkasan menunjukkan pihak yang menghantar laporan, tempoh dalam UTC dan dasar yang diterbitkan oleh domain. Fail dan teks yang ditampal diproses dalam pelayar anda.

## Cara mentafsir bilangan mesej

Setiap rekod sumber mengumpulkan mesej dengan IP sumber dan hasil penilaian yang sama. Satu rekod boleh mewakili beberapa mesej, dan IP yang sama boleh muncul dalam beberapa rekod. Jumlah dikira menggunakan bilangan mesej dalam setiap baris. Mesej lulus DMARC apabila SPF atau DKIM lulus dengan domain yang sepadan dengan domain yang tertera dalam medan From. Mesej hanya dikira gagal apabila kedua-dua semakan kesepadanan gagal. Data kesepadanan yang tidak lengkap dipaparkan sebagai tidak diketahui.

## Mengapa kesepadanan, pengesahan dan tindakan boleh berbeza

Kembangkan bahagian Keputusan pengesahan asal untuk melihat domain, keputusan dan pemilih DKIM yang dilaporkan. SPF atau DKIM boleh lulus untuk domain lain walaupun semakan kesepadanan DMARC gagal. Tindakan yang diambil menerangkan cara pihak penerima mengendalikan sekumpulan mesej. Tindakan itu boleh berbeza daripada dasar yang diterbitkan jika pihak penerima membuat pengecualian. Tapis mengikut IP sumber atau domain From untuk menyemak penghantar tertentu. Jumlah keseluruhan kekal sama.

## Format XML DMARC yang disokong

Pemapar membaca laporan agregat mengikut RFC 9990, termasuk ruang nama DMARC yang ditetapkan dalam standard itu, dan laporan lama berdasarkan RFC 7489. RFC 9990 menerangkan format XML yang digunakan untuk meringkaskan pengesahan dan tindakan dalam laporan agregat. Jika sistem e-mel anda menggabungkan beberapa laporan dalam satu arkib, ekstrak laporan yang ingin disemak dan buka secara berasingan.
