## Cara membaca laporan agregat DMARC

Buka lampiran laporan agregat yang dikirim ke alamat `rua` dalam record DMARC Anda. Penampil mendukung XML, GZIP, dan ZIP yang berisi satu laporan XML. Anda juga dapat menempelkan XML atau memuat contoh. Ringkasan menunjukkan pengirim laporan, periode dalam UTC, dan kebijakan yang dipublikasikan oleh domain. File dan teks yang ditempel diproses di browser Anda.

## Cara menafsirkan jumlah pesan

Setiap record sumber mengelompokkan pesan yang memiliki IP sumber dan hasil evaluasi yang sama. Satu record dapat mencakup beberapa pesan, dan IP yang sama dapat muncul dalam beberapa record. Total dihitung dari jumlah pesan di setiap baris. Pesan lulus DMARC jika SPF atau DKIM lulus dan domainnya selaras dengan domain yang terlihat di kolom From. Pesan hanya dihitung sebagai gagal jika kedua hasil pemeriksaan keselarasan gagal. Data keselarasan yang tidak lengkap ditampilkan sebagai tidak diketahui.

## Mengapa keselarasan, autentikasi, dan tindakan bisa berbeda

Perluas bagian Hasil autentikasi mentah untuk melihat domain, hasil, dan selektor DKIM yang dilaporkan. SPF atau DKIM dapat lulus untuk domain yang berbeda meskipun pemeriksaan keselarasan DMARC gagal. Tindakan yang diterapkan menunjukkan cara penerima menangani sekelompok pesan. Tindakan itu dapat berbeda dari kebijakan yang dipublikasikan jika penerima membuat pengecualian. Filter menurut IP sumber atau domain From untuk memeriksa pengirim tertentu. Total keseluruhan tidak berubah.

## Format XML DMARC yang didukung

Penampil membaca laporan agregat sesuai RFC 9990, termasuk namespace DMARC yang ditetapkan di dalamnya, serta laporan lama berdasarkan RFC 7489. RFC 9990 menjelaskan format XML yang digunakan untuk merangkum autentikasi dan tindakan dalam laporan agregat. Jika sistem email Anda menyimpan beberapa laporan dalam satu arsip, ekstrak laporan yang ingin diperiksa dan buka secara terpisah.
