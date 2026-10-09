## Baca teks dan log secara setempat

Buka fail .txt, .text atau .log untuk membacanya dengan nombor baris, saiz teks boleh laras, pilihan pembalutan baris dan bacaan berfokus. Pergi ke baris tertentu, beralih ke awal atau akhir, atau gunakan Cari teks untuk mencari di seluruh fail. Carian adalah literal dan membezakan huruf besar dan kecil; carian seterusnya dan sebelumnya kembali ke hujung fail yang satu lagi apabila mencapai hujung.

## Fail besar dan baris panjang

Pembaca memaparkan satu bahagian pada satu masa supaya fail besar kekal mudah digunakan. Setiap bahagian tetap boleh diakses, termasuk sambungan baris yang sangat panjang. Pemilihan teks dan perintah carian pelayar anda meliputi bahagian semasa; Cari teks dalam pembaca mencari dalam keseluruhan fail yang dinyahkod, termasuk padanan yang merentasi sempadan bahagian. Tiada had saiz fail atau bilangan baris dikenakan. Memori pelayar yang tersedia masih menetapkan had praktikal.

Baris kosong, tab, campuran pengakhiran baris CRLF/CR/LF dan teks Unicode dikekalkan. Pengakhiran baris dipaparkan sebagai pemisah baris. Penanda dan jujukan lepas terminal kekal sebagai teks yang tidak dilaksanakan. Sesetengah aksara kawalan tiada bentuk yang kelihatan; fail yang mengandungi aksara NUL menerima notis fail binari.

## Pilih pengekodan yang betul

Mod automatik mengenali tanda tertib bait UTF-8 dan UTF-16, dan jika tiada, menggunakan UTF-8 yang ketat. Anda boleh memilih UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 atau Shift JIS. Ralat penyahkodan menghentikan pratonton tanpa menggantikan aksara yang tidak boleh dibaca secara senyap. Cuba pengekodan lain jika fail tidak boleh dibaca atau kelihatan bercelaru; pemapar tidak dapat menentukan pengekodan asal setiap fail.

Fail diproses pada peranti anda tanpa muat naik, sumber jauh atau penyimpanan automatik. Menutup atau mengganti fail membebaskan sesi bacaannya. Pemapar ini tidak menyunting fail, mentafsir HTML atau perintah terminal, atau mengikuti log secara langsung.
