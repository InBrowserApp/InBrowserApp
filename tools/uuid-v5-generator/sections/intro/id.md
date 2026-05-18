Buat identifier UUID v5 dari UUID namespace dan nama tanpa mengirim salah satu nilai tersebut ke server. UUID v5 berguna saat Anda membutuhkan identifier stabil yang dapat dibuat ulang nanti dari input yang sama, seperti ID untuk nama domain, URL, path objek, handle akun, atau record fixture.

## Cara Kerja UUID v5

UUID v5 menggabungkan UUID namespace dengan string nama, melakukan hash pada byte tersebut dengan SHA-1, lalu menerapkan bit versi dan varian RFC 4122. Karena inputnya deterministik, `example.com` di dalam namespace DNS selalu menghasilkan UUID yang sama: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Memilih Namespace

Gunakan `ns:DNS` untuk nama domain, `ns:URL` untuk URL, `ns:OID` untuk identifier objek, dan `ns:X.500 DN` untuk distinguished name X.500. Anda juga dapat menempel namespace UUID sendiri saat aplikasi Anda membutuhkan identifier yang dibatasi cakupannya ke produk, tenant, dataset, atau migrasi.

## Kapan Menggunakannya

Pilih UUID v5 saat reproduksibilitas lebih penting daripada keacakan. Ini cocok untuk impor deterministik, fixture pengujian, record ber-namespace, dan sistem yang membutuhkan item logis yang sama untuk menerima ID yang sama di setiap eksekusi. Untuk token rahasia atau ID publik yang tidak dapat diprediksi, gunakan generator acak sebagai gantinya.
