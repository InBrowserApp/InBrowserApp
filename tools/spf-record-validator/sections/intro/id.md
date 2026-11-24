## Cara memeriksa record SPF

Tempel nilai satu record TXT DNS yang diawali `v=spf1`, lalu pilih Periksa sintaks. Jika DNS menampilkan nilai TXT sebagai beberapa string dalam tanda kutip, gabungkan string sesuai urutannya dan pertahankan spasi di dalamnya. Pemeriksa menampilkan setiap mekanisme atau pengubah dan menandai kesalahan sintaks di dekat bagian yang perlu diperbaiki. Input tetap berada di browser.

## Cara kerja mekanisme dan kualifikator SPF

SPF (Sender Policy Framework) memungkinkan sebuah domain menentukan server mana yang boleh mengirim email atas namanya. Server penerima memeriksa mekanisme secara berurutan. Contohnya, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` memeriksa suatu blok IPv4 dan kebijakan SPF penyedia sebelum mencapai `-all`. Kualifikator pada mekanisme menunjukkan hasil lulus (`+`), gagal (`-`), indikasi gagal yang lebih lemah (softfail) (`~`), atau netral (`?`). Kualifikator bawaannya adalah `+`. Pengubah seperti `redirect=` menggunakan tanda sama dengan dan tidak memiliki kualifikator.

## Arti jumlah komponen yang dapat memicu kueri DNS

RFC 7208 mengizinkan maksimal 10 komponen yang memicu kueri DNS selama evaluasi SPF. Angka di sini menghitung kemungkinan komponen tersebut dalam record yang ditempel, termasuk `a`, `mx`, `include`, `exists`, `ptr`, dan `redirect` yang aktif. Komponen `include` atau `redirect` dapat merujuk ke komponen tambahan, sedangkan mekanisme yang cocok dapat mengakhiri evaluasi lebih awal. Untuk memastikan kebijakan SPF yang berlaku dan jumlah seluruh komponen pemicu kuerinya, periksa record TXT yang dipublikasikan dan domain yang dirujuknya.
