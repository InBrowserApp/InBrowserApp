## Apa itu VIN?

Nombor Pengenalan Kenderaan (VIN) ialah kod 17 aksara yang mengenal pasti kenderaan secara unik.

- `1M8GDM9AXKP042788`
- Huruf I, O, Q tidak digunakan
- Aksara ke-9 ialah digit semak

### Struktur VIN

1. **WMI** (kedudukan 1-3): Pengenal Pengilang Dunia
2. **VDS** (kedudukan 4-8): Bahagian Penerangan Kenderaan
3. **Digit semak** (kedudukan 9): dikira daripada semua aksara lain
4. **VIS** (kedudukan 10-17): Bahagian Pengenal Kenderaan

### Digit semak

Setiap huruf ditukar kepada nombor (A=1, B=2, ... melangkau I, O, Q). Setiap kedudukan mempunyai pemberat. Jumlah berpemberat mod 11 menghasilkan digit semak; 10 diwakili oleh X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = digit semak`

Alat ini hanya mengesahkan format dan peraturan digit semak. Ia tidak mengesahkan pendaftaran dunia sebenar.
