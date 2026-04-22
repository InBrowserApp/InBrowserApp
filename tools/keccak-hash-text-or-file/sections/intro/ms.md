## Apakah Keccak?

Keccak adalah keluarga fungsi hash kriptografi yang berfungsi sebagai asas untuk standard SHA-3 (Secure Hash Algorithm 3). Dibangunkan oleh Guido Bertoni, Joan Daemen, Michaël Peeters dan Gilles Van Assche, ia memenangi pertandingan fungsi hash NIST pada 2012.

**Ciri-ciri utama:**

- **Pembinaan span**: Menggunakan reka bentuk fungsi span inovatif dengan fasa penyerapan dan pemerasan
- **Panjang output berubah**: Dapat menghasilkan output hash dengan sebarang panjang yang dikehendaki
- **Margin keselamatan tinggi**: Direka dengan rizab keselamatan yang besar
- **Berbeza daripada SHA-1/SHA-2**: Berdasarkan prinsip matematik yang sama sekali berbeza
- **Varian Keccak[c=2d]**: Pelaksanaan ini menggunakan spesifikasi Keccak asal dengan kapasiti c = 2d (di mana d ialah panjang output)

**Perbezaan Keccak vs SHA-3 (FIPS 202):**
🔍 **Perbezaan penting**: Keccak asal dan SHA-3 piawai **tidak sama**:

- **Keccak asal**: Menggunakan kapasiti c = 2d dan padding berbeza (padding Keccak: 0x01)
- **FIPS 202 SHA-3**: Menggunakan kapasiti c = 2d tetapi padding berbeza (padding SHA-3: 0x06)
- **Pemisahan domain**: Perbezaan padding memastikan Keccak dan SHA-3 menghasilkan output berbeza untuk input yang sama
- **Pelaksanaan alat ini**: **Spesifikasi Keccak asal** dengan parameterisasi Keccak[c=2d]

**Status keselamatan:**
✅ **Keccak dianggap sangat selamat** tanpa serangan praktikal yang diketahui. Ia menyediakan margin keselamatan yang cemerlang dan rintangan terhadap pelbagai teknik analisis kriptografi.

**Kegunaan biasa:**

- Blockchain Ethereum (menggunakan Keccak-256 asal)
- Penyelidikan akademik dan protokol kriptografi
- Aplikasi yang memerlukan output hash panjang berubah
- Sistem yang memerlukan alternatif kepada keluarga SHA-2
- Pelaksanaan blockchain dan mata wang kripto

**Kelebihan berbanding hash tradisional:**

- Reka bentuk yang berbeza secara asas mengurangkan risiko serangan berkaitan
- Panjang output fleksibel (tidak terhad kepada saiz tetap)
- Asas keselamatan teori yang kukuh
- Rintangan terhadap serangan sambungan panjang
- Prestasi cemerlang merentas pelbagai platform

**Nota teknikal:**

- **Keccak-256**: Menghasilkan output 256-bit (varian paling biasa)
- **Formula kapasiti**: c = 2d memastikan tahap keselamatan yang sesuai
- **Penggunaan Ethereum**: Ethereum secara khusus menggunakan Keccak-256 asal, bukan SHA3-256
