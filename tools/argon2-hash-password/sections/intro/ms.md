## Apakah Argon2?

Argon2 ialah algoritma hashing kata laluan yang direka untuk menjadikan pemecahan kata laluan luar talian mahal. Ia menggabungkan pengiraan berulang dengan kos memori yang boleh dikonfigurasi, jadi penyerang memerlukan masa dan memori bagi setiap tekaan kata laluan.

**Mengapa Argon2id biasanya menjadi lalai:**

- Ia mengimbangi rintangan terhadap serangan saluran sisi dan pemecahan GPU dengan lebih baik berbanding menggunakan Argon2i atau Argon2d untuk kebanyakan sistem penyimpanan kata laluan
- Output yang dikodkan menyimpan algoritma, versi, memori, iterasi, paralelisme, salt, dan hash dalam satu rentetan mudah alih
- Salt rawak yang unik menghalang kata laluan yang sama daripada menghasilkan hash tersimpan yang sama
- Tetapan memori dan iterasi boleh dinaikkan apabila persekitaran pengesahan anda menjadi lebih pantas

**Cara menggunakan alat ini:**

1. Masukkan kata laluan yang ingin anda hash.
2. Kekalkan salt yang dijana atau cipta salt rawak baharu.
3. Pilih varian Argon2 dan tala memori, iterasi, paralelisme, serta panjang hash untuk sistem yang akan mengesahkan hash.
4. Jana hash yang dikodkan dan simpan keseluruhan rentetan itu dalam pangkalan data aplikasi anda.

**Nota keselamatan:**

- Jangan simpan atau log kata laluan biasa.
- Gunakan salt rawak baharu untuk setiap kata laluan.
- Gunakan rahsia pilihan hanya jika pengesah anda juga mempunyai rahsia yang sama; jika tidak, hash tidak dapat disahkan kemudian.
- Utamakan tetapan memori dan iterasi tertinggi yang masih mengekalkan kependaman log masuk yang boleh diterima untuk pengguna sebenar.
