## Fungsi Alat Ini

Alat ini menukar alamat IP permulaan dan alamat IP tamat kepada set terkecil blok CIDR yang betul-betul meliputi julat penuh. Semuanya berjalan secara setempat dalam penyemak imbas anda, jadi alamat tidak pernah meninggalkan peranti anda.

## Cara Perlindungan CIDR Berfungsi

Blok CIDR mewakili rangkaian bersaiz kuasa dua yang dijajarkan pada sempadan yang sepadan. Apabila julat bermula atau berakhir di tengah-tengah sempadan tersebut, satu blok tidak mencukupi. Penukar terus mengambil blok sejajar terbesar yang sesuai, kemudian berulang sehingga keseluruhan julat dilindungi.

## Mengapa Pelbagai Blok Boleh Muncul

Julat seperti 192.168.1.10 hingga 192.168.1.25 tidak bermula pada sempadan rangkaian yang bersih dan tidak berakhir pada satu sama ada. Oleh itu, hasil yang tepat ialah senarai pendek blok, setiap satu meliputi satu bahagian yang sejajar tanpa memasukkan alamat tambahan di luar julat yang diminta.

## Apabila Ini Berguna

Gunakannya semasa menyediakan peraturan tembok api, ringkasan laluan, entri ACL, kumpulan keselamatan awan atau senarai semak migrasi yang julat permulaan dan tamat mentah perlu menjadi tatatanda CIDR standard.
