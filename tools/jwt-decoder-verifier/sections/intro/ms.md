## What is a JWT decoder and verifier?

JSON Web Token ialah rentetan padat dengan tiga segmen base64url: pengepala, muatan, dan tandatangan. Alat ini menyahkod pengepala dan muatan dalam pelayar anda supaya anda boleh menyemak struktur token tanpa menghantarnya ke pelayan.

Pengesahan tandatangan menyemak sama ada token ditandatangani dengan kunci dan algoritma yang anda jangkakan. Gunakan rahsia berkongsi untuk token HS256, HS384, atau HS512. Gunakan kunci awam PEM, JWK, atau JWKS untuk token RS, PS, dan ES.

## When to use it

Gunakan penyahkod semasa menyahpepijat aliran pengesahan, menyemak tuntutan OAuth atau OpenID Connect, membandingkan persekitaran, atau mengesahkan bahawa backend mengeluarkan nilai khalayak, pengeluar, subjek, tamat tempoh, dan pengecam kunci yang dijangkakan.

Gunakan pengesahan apabila anda mempunyai rahsia atau kunci awam yang sepadan dan perlu mengesahkan bahawa pengepala, muatan, dan tandatangan masih tergolong bersama. Alat ini juga menyerlahkan `exp`, `nbf`, dan `iat` supaya isu jam dan tamat tempoh yang lazim kelihatan serta-merta.

## Security notes

Muatan JWT hanya dikodkan, bukan disulitkan. Sesiapa yang mempunyai token boleh membaca tuntutannya melainkan token itu ialah JWE disulitkan yang berasingan, yang tidak diproses oleh alat ini.

Jangan tampal token produksi atau rahsia peribadi pada mesin berkongsi. Alat ini berjalan secara setempat dalam pelayar anda dan tidak menyimpan token atau bahan pengesahan, tetapi aliran kerja paling selamat tetap menggunakan token ujian berjangka hayat pendek dan kunci awam apabila boleh.
