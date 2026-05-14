## Apa itu parser sertifikat X.509?

Sertifikat X.509 adalah dokumen bertanda tangan yang mengikat kunci publik ke identitas seperti domain, layanan, organisasi, atau orang. Sertifikat TLS, file rantai sertifikat, dan banyak alur kerja S/MIME atau penandatanganan menggunakan format ini.

Parser ini membaca materi sertifikat dan kunci publik langsung di browser Anda. Alat ini dapat memeriksa blok PEM, file DER biner, dan teks base64 DER, lalu menampilkan subject, issuer, nomor seri, jendela validitas, algoritma tanda tangan, algoritma kunci publik, fingerprint, dan ekstensi umum.

Gunakan alat ini saat Anda perlu membandingkan fingerprint sertifikat, memeriksa apakah sertifikat ditujukan untuk host yang diharapkan, memeriksa Subject Alternative Names, mengonfirmasi penggunaan kunci, atau mengekstrak detail kunci publik saat men-debug masalah TLS dan deployment.

Alat ini tidak memvalidasi rantai kepercayaan atau menghubungi otoritas sertifikat. Alat ini menampilkan apa yang dikodekan dalam sertifikat atau kunci publik yang Anda berikan, jadi gunakan pemindai TLS khusus saat Anda memerlukan validasi pencabutan, rantai, hostname, atau endpoint langsung.

- Bandingkan fingerprint SHA-256 atau SHA-1 sebelum memasang atau merotasi sertifikat.
- Tinjau SAN, penggunaan kunci, penggunaan kunci lanjutan, dan batasan dasar tanpa mengunggah materi sertifikat.
- Periksa kunci publik SPKI mandiri saat layanan hanya memberi Anda file kunci publik PEM atau DER.
