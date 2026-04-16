## Apa itu IBAN?

IBAN (International Bank Account Number) adalah pengenal standar untuk rekening bank yang digunakan dalam pembayaran internasional.

### Struktur IBAN

IBAN dimulai dengan kode negara dua huruf, dua digit pemeriksa, dan BBAN khusus negara.

### Validasi checksum

Keabsahan IBAN diperiksa dengan algoritma mod-97 ISO 13616.

1. Hapus spasi dan pindahkan empat karakter pertama ke akhir
2. Ubah huruf menjadi angka (A=10, B=11, ..., Z=35)
3. Hitung mod 97; IBAN yang valid menghasilkan sisa 1

Setiap negara menentukan panjang dan struktur tetap untuk bagian BBAN.
