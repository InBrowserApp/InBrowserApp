## What is an X.509 certificate parser?

Sijil X.509 ialah dokumen bertandatangan yang mengikat kunci awam kepada identiti seperti domain, perkhidmatan, organisasi, atau individu. Sijil TLS, fail rantaian sijil, dan banyak aliran kerja S/MIME atau tandatangan menggunakan format ini.

Penghurai ini membaca bahan sijil dan kunci awam terus dalam pelayar anda. Ia boleh memeriksa blok PEM, fail DER binari, dan teks DER base64, kemudian memaparkan subjek, pengeluar, nombor siri, tempoh kesahan, algoritma tandatangan, algoritma kunci awam, cap jari, dan sambungan lazim.

Gunakannya apabila anda perlu membandingkan cap jari sijil, menyemak sama ada sijil adalah untuk hos yang dijangka, memeriksa Subject Alternative Names, mengesahkan penggunaan kunci, atau mengekstrak butiran kunci awam semasa menyahpepijat isu TLS dan pelaksanaan.

Alat ini tidak mengesahkan rantaian amanah atau menghubungi autoriti sijil. Ia memaparkan perkara yang dikodkan dalam sijil atau kunci awam yang anda berikan, jadi gunakan pengimbas TLS khusus apabila anda memerlukan pengesahan pembatalan, rantaian, nama hos, atau titik akhir langsung.

- Bandingkan cap jari SHA-256 atau SHA-1 sebelum memasang atau menggilirkan sijil.
- Semak SAN, penggunaan kunci, penggunaan kunci lanjutan, dan kekangan asas tanpa memuat naik bahan sijil.
- Periksa kunci awam SPKI kendiri apabila perkhidmatan hanya memberikan fail PEM atau DER kunci awam kepada anda.
