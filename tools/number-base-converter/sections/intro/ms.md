Tukar nombor bulat terus dalam pelayar antara binari, oktal, perpuluhan, heksadesimal, Base32, Base36, Base62, Base64 dan asas tersuai dari 2 hingga 64. Semua pengiraan dijalankan secara setempat dengan BigInt, jadi anda boleh memeriksa nilai besar tanpa menghantarnya ke pelayan.

## Bila sesuai digunakan

Alat ini berguna apabila nombor bulat yang sama muncul dalam log, protokol, ID atau spesifikasi dengan abjad yang berbeza. Mengubah mana-mana medan akan mengira semula medan lain serta-merta, jadi ia sesuai untuk penyahpepijatan, dokumentasi dan semakan manual.

## Perbezaan antara asas

Sehingga asas 36, huruf diterima tanpa membezakan huruf besar dan kecil. Asas yang lebih tinggi menganggap huruf besar dan kecil sebagai digit yang berbeza, dan baris Base64 di sini menggunakan abjad angka `A-Z a-z 0-9 + /`, bukannya pengekodan teks Base64 berasaskan bait.

## Perkara yang perlu diperhatikan

Hanya nombor bulat bukan negatif disokong. Sifar di depan dianggap sebagai pemformatan, jadi output yang ditukar dinormalkan dan mungkin tidak mengekalkan padding yang anda taip.
