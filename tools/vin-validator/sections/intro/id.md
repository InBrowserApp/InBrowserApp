## Apa itu VIN?

Vehicle Identification Number (VIN) adalah kode 17 karakter yang mengidentifikasi kendaraan secara unik.

- `1M8GDM9AXKP042788`
- Huruf I, O, Q tidak digunakan
- Karakter ke-9 adalah digit cek

### Struktur VIN

1. **WMI** (posisi 1-3): World Manufacturer Identifier
2. **VDS** (posisi 4-8): Vehicle Descriptor Section
3. **Digit cek** (posisi 9): dihitung dari semua karakter lainnya
4. **VIS** (posisi 10-17): Vehicle Identifier Section

### Digit cek

Setiap huruf ditransliterasikan menjadi angka (A=1, B=2, ... melewati I, O, Q). Setiap posisi memiliki bobot. Jumlah tertimbang mod 11 menghasilkan digit cek; angka 10 direpresentasikan oleh X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = digit cek`

Alat ini hanya memvalidasi format dan aturan digit cek. Alat ini tidak memverifikasi pendaftaran kendaraan di dunia nyata.
