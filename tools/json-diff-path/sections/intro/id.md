## Gambaran Umum

JSON Diff Path membandingkan dua dokumen JSON dan mengubah setiap perubahan
struktural menjadi catatan path yang mudah dibaca, lengkap dengan keluaran
JSONPath dan JSON Pointer.

## Kapan Digunakan

Gunakan alat ini saat Anda perlu meninjau perubahan payload API, memeriksa
migrasi konfigurasi, atau menghasilkan operasi RFC 6902 JSON Patch untuk
otomatisasi.

## Cara Kerjanya

Alat ini mengurai kedua input JSON, menghitung perubahan `add`, `remove`, dan
`replace`, lalu memungkinkan Anda memfilter operasi tersebut dan beralih antara
daftar path dan output JSON Patch di panel hasil yang sama.
