## Cara mengetes keyboard

Pilih **Mulai tes**, lalu tekan dan lepaskan tombol di keyboard fisik satu per satu. Tombol pada diagram menyala selama ditahan dan menyisakan titik kecil setelah dilepas. Uji Ctrl, Shift, dan Alt di sisi kiri maupun kanan, serta uji panel angka secara terpisah jika ada. Pilih **Atur ulang** untuk menghapus tanda dan mengulang tes.

## Menguji kombinasi tombol, rollover, dan ghosting

Coba kombinasi yang biasa Anda gunakan di gim atau aplikasi. Misalnya, tahan `W`, `A`, `Shift`, dan `Space` sekaligus. Jika browser mendeteksi semuanya, **Kombinasi saat ini** akan menampilkan keempat tombol. **Terbanyak sekaligus** menyimpan jumlah tertinggi tombol yang terdeteksi bersamaan selama tes, termasuk tombol pengubah.

Rollover adalah kemampuan keyboard untuk mendeteksi beberapa tombol yang ditekan sekaligus. Jika sebuah tombol terdeteksi saat ditekan sendiri tetapi hilang dalam kombinasi tertentu, keyboard mungkin memblokir input tombol itu. Jika muncul tombol yang tidak Anda tekan, hal itu bisa jadi ghosting. Coba kombinasi yang bermasalah secara langsung karena hasilnya bisa berbeda untuk tiap kelompok tombol. [Demo ghosting keyboard dari Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Mengapa tombol tidak terdeteksi?

Pilih **Mulai tes** lagi jika Anda mengeklik area lain atau menekan Tab atau Esc untuk keluar dari area tes. Beberapa tombol, seperti Fn dan tombol media tertentu, ditangani oleh keyboard atau sistem operasi. Browser juga dapat menangani pintasan sebelum masukannya sampai ke halaman ini. Jika tombol huruf tetap tidak merespons saat ditekan sendiri, coba di aplikasi lain untuk melihat apakah masalahnya terulang.

## Mengapa tombol lain yang menyala?

Diagram mengacu pada posisi fisik tombol pada keyboard ANSI ukuran penuh. Pada tata letak AZERTY Prancis, menekan `A` dapat membuat `Q` menyala pada diagram. **Tombol terakhir** tetap menampilkan nilai dari tata letak yang Anda gunakan, yaitu `a`, bersama kode posisi fisik `KeyQ`. Jika memakai keyboard ringkas, fokuslah pada tombol yang memang tersedia. [Panduan MDN tentang kode posisi fisik tombol](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)

[Penguji Mouse](../mouse-tester/)
