## Apa itu Keccak?

Keccak adalah keluarga fungsi hash kriptografi yang berfungsi sebagai dasar untuk standar SHA-3 (Secure Hash Algorithm 3). Dikembangkan oleh Guido Bertoni, Joan Daemen, Michaël Peeters, dan Gilles Van Assche, memenangkan kompetisi fungsi hash NIST pada 2012.

**Karakteristik utama:**

- **Konstruksi spons**: Menggunakan desain fungsi spons inovatif dengan fase penyerapan dan pemerasan
- **Panjang output variabel**: Dapat menghasilkan output hash dengan panjang yang diinginkan
- **Margin keamanan tinggi**: Dirancang dengan cadangan keamanan yang substansial
- **Berbeda dari SHA-1/SHA-2**: Berdasarkan prinsip matematika yang sepenuhnya berbeda
- **Varian Keccak[c=2d]**: Implementasi ini menggunakan spesifikasi Keccak asli dengan kapasitas c = 2d (di mana d adalah panjang output)

**Perbedaan Keccak vs SHA-3 (FIPS 202):**
🔍 **Perbedaan penting**: Keccak asli dan SHA-3 yang distandarisasi **tidak identik**:

- **Keccak asli**: Menggunakan kapasitas c = 2d dan padding berbeda (padding Keccak: 0x01)
- **FIPS 202 SHA-3**: Menggunakan kapasitas c = 2d tetapi padding berbeda (padding SHA-3: 0x06)
- **Pemisahan domain**: Perbedaan padding memastikan Keccak dan SHA-3 menghasilkan output berbeda untuk input yang sama
- **Tool ini mengimplementasikan**: **Spesifikasi Keccak asli** dengan parametrisasi Keccak[c=2d]

**Status keamanan:**
✅ **Keccak dianggap sangat aman** tanpa serangan praktis yang diketahui. Memberikan margin keamanan yang sangat baik dan ketahanan terhadap berbagai teknik kriptoanalisis.

**Penggunaan umum:**

- Blockchain Ethereum (menggunakan Keccak-256 asli)
- Penelitian akademis dan protokol kriptografi
- Aplikasi yang memerlukan output hash dengan panjang variabel
- Sistem yang membutuhkan alternatif keluarga SHA-2
- Implementasi blockchain dan cryptocurrency

**Keunggulan dibanding hash tradisional:**

- Desain yang fundamental berbeda mengurangi risiko serangan terkait
- Panjang output fleksibel (tidak terbatas pada ukuran tetap)
- Fondasi keamanan teoritis yang kuat
- Ketahanan terhadap serangan perpanjangan panjang
- Kinerja sangat baik di berbagai platform

**Catatan teknis:**

- **Keccak-256**: Menghasilkan output 256-bit (varian paling umum)
- **Formula kapasitas**: c = 2d memastikan tingkat keamanan yang sesuai
- **Penggunaan Ethereum**: Ethereum secara khusus menggunakan Keccak-256 asli, bukan SHA3-256
