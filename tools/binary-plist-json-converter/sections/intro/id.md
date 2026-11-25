## Mengonversi file Plist biner ke JSON

Pilih **Buka Plist biner** atau seret dan lepaskan file `.plist` biner Apple. Tinjau JSON yang telah diformat, salin, atau unduh sebagai file `.json`. Daftar properti biner diawali dengan tanda pengenal `bplist00` dan digunakan dalam bundel aplikasi Apple, file preferensi, dan data arsip. Contoh yang tersedia memperlihatkan bagaimana nilai daftar properti direpresentasikan dalam JSON.

## Mengonversi JSON ke daftar properti biner Apple

Pilih **JSON ke Plist**, tempel JSON atau buka file `.json`, lalu pilih **Konversi ke Plist biner**. Unduh file `.plist` hasil konversi. String, boolean, angka, array, dan objek dipetakan ke tipe yang sesuai dalam daftar properti. Ganti `null` dengan nilai lain atau hapus kuncinya. File dan teks yang ditempel diproses di browser Anda.

## Mempertahankan tanggal, bita, dan bilangan bulat besar

JSON tidak menyediakan tipe bawaan untuk tanggal, data bita, atau UID arsip berkunci. Konverter memakai tag `$plist` agar makna nilai tersebut tetap sama saat dikonversi dalam dua arah.

| Nilai Plist                               | Contoh JSON                                            |
| ----------------------------------------- | ------------------------------------------------------ |
| Tanggal dalam UTC                         | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bita dalam Base64                         | `{"$plist":"data","value":"AQID"}`                     |
| Bilangan bulat besar sebagai teks desimal | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID arsip berkunci                        | `{"$plist":"uid","value":42}`                          |
| Bilangan riil besar                       | `{"$plist":"real","value":"1e+100"}`                   |

Pertahankan tag saat mengonversi kembali ke Plist. Untuk bilangan bulat di luar rentang aman JSON, tulis nilai desimal dalam tanda kutip dan gunakan tag bilangan bulat. Kamus yang strukturnya sama dengan tag akan dibungkus dengan tag `dictionary` agar kuncinya tetap tersimpan. Konversi mempertahankan struktur dan nilai yang didukung. Urutan objek Plist, tipe numerik bilangan riil bernilai bulat seperti `1.0`, dan bita biner asli dapat berubah.

[Struktur dan tipe daftar properti Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
