## Menukar fail Plist binari kepada JSON

Pilih **Buka Plist binari** atau seret dan lepaskan fail `.plist` binari Apple. Semak JSON yang telah diformatkan, salin atau muat turun sebagai fail `.json`. Senarai sifat binari bermula dengan tandatangan `bplist00` dan digunakan dalam himpunan aplikasi Apple, fail keutamaan dan data arkib. Contoh menunjukkan cara nilai senarai sifat dipaparkan dalam JSON.

## Menukar JSON kepada senarai sifat binari Apple

Pilih **JSON kepada Plist**, tampal JSON atau buka fail `.json`, kemudian pilih **Tukar kepada Plist binari**. Muat turun fail `.plist` yang terhasil. Rentetan, nilai Boolean, nombor, tatasusunan dan objek dipadankan dengan jenis yang sepadan dalam senarai sifat. Gantikan `null` dengan nilai lain atau buang kuncinya. Fail dan teks yang ditampal diproses dalam pelayar anda.

## Mengekalkan tarikh, bait dan integer besar

JSON tiada jenis terbina dalam untuk tarikh, data bait atau UID arkib berkunci. Penukar menggunakan teg `$plist` supaya nilai ini mengekalkan maknanya apabila ditukar dalam kedua-dua arah.

| Nilai Plist                           | Contoh JSON                                            |
| ------------------------------------- | ------------------------------------------------------ |
| Tarikh dalam UTC                      | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bait dalam Base64                     | `{"$plist":"data","value":"AQID"}`                     |
| Integer besar sebagai teks perpuluhan | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID arkib berkunci                    | `{"$plist":"uid","value":42}`                          |

Kekalkan teg apabila menukar kembali kepada Plist. Bagi integer di luar julat selamat JSON, tulis nilai perpuluhan dalam tanda petik bersama teg integer. Kamus yang mempunyai struktur yang sama seperti teg dibalut dengan teg `dictionary` untuk mengekalkan kuncinya. Penukaran mengekalkan struktur dan nilai yang disokong. Tertib objek Plist, bilangan bait untuk menyimpan nombor dan bait binari asal boleh berubah.

[Struktur dan jenis senarai sifat Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
