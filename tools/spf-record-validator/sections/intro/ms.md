## Cara menyemak rekod SPF

Tampal nilai satu rekod TXT DNS yang bermula dengan `v=spf1`, kemudian pilih Semak sintaks. Jika DNS memaparkan nilai TXT sebagai beberapa rentetan dalam tanda petikan, gabungkan rentetan itu mengikut turutan dan kekalkan ruang di dalamnya. Penyemak memaparkan setiap mekanisme atau pengubah dan menandakan ralat sintaks di sebelah bahagian yang perlu dibetulkan. Input kekal dalam pelayar anda.

## Cara mekanisme dan penentu SPF berfungsi

SPF (Sender Policy Framework) membolehkan domain menentukan pelayan yang dibenarkan menghantar e-mel bagi pihaknya. Pelayan penerima menyemak mekanisme mengikut turutan. Contohnya, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` menyemak blok IPv4 dan dasar SPF penyedia sebelum `-all` di akhir rekod. Penentu pada mekanisme menunjukkan keputusan lulus (`+`), gagal (`-`), petunjuk gagal yang lebih lemah (softfail) (`~`) atau neutral (`?`). Penentu lalai ialah `+`. Pengubah seperti `redirect=` menggunakan tanda sama dengan dan tidak mempunyai penentu.

## Maksud bilangan komponen yang mencetuskan carian DNS

RFC 7208 membenarkan sehingga 10 komponen yang mencetuskan carian DNS semasa penilaian SPF. Angka di sini mengira komponen yang boleh mencetuskan carian dalam rekod yang ditampal, termasuk `a`, `mx`, `include`, `exists`, `ptr` dan `redirect` yang aktif. Komponen `include` atau `redirect` boleh membawa kepada komponen tambahan, manakala mekanisme yang sepadan boleh menamatkan penilaian lebih awal. Untuk mengesahkan dasar SPF yang sedang digunakan dan jumlah komponen pencetus carian, semak rekod TXT yang diterbitkan serta domain yang dirujuk.
