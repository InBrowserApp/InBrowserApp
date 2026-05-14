## Apa itu decoder dan verifier JWT?

JSON Web Token adalah string ringkas dengan tiga segmen base64url: header, payload, dan tanda tangan. Alat ini mendekode header dan payload di browser Anda sehingga Anda dapat memeriksa struktur token tanpa mengirimkannya ke server.

Verifikasi tanda tangan memeriksa apakah token ditandatangani dengan kunci dan algoritma yang Anda harapkan. Gunakan shared secret untuk token HS256, HS384, atau HS512. Gunakan public key PEM, JWK, atau JWKS untuk token RS, PS, dan ES.

## Kapan menggunakannya

Gunakan decoder saat men-debug alur autentikasi, memeriksa klaim OAuth atau OpenID Connect, membandingkan environment, atau memastikan backend menerbitkan nilai audience, issuer, subject, expiration, dan key identifier yang diharapkan.

Gunakan verifikasi saat Anda memiliki secret atau public key yang cocok dan perlu memastikan bahwa header, payload, dan tanda tangan masih saling sesuai. Alat ini juga menyorot `exp`, `nbf`, dan `iat` sehingga masalah umum terkait waktu sistem dan kedaluwarsa langsung terlihat.

## Catatan keamanan

Payload JWT hanya dienkode, bukan dienkripsi. Siapa pun yang memiliki token dapat membaca klaimnya kecuali token tersebut adalah JWE terenkripsi terpisah, yang tidak diproses oleh alat ini.

Jangan tempel token produksi atau secret privat di mesin bersama. Alat ini berjalan secara lokal di browser Anda dan tidak menyimpan token atau materi verifikasi, tetapi alur kerja paling aman tetap menggunakan token uji berumur pendek dan public key bila memungkinkan.
