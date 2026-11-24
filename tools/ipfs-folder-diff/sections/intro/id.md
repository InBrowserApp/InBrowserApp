## Bandingkan CID dua folder IPFS

Tempel alamat folder asli ke **Folder awal** dan alamat folder yang sudah diperbarui ke **Folder yang diperbarui**, lalu pilih **Bandingkan folder**. Kedua kolom menerima CID, alamat `ipfs://`, atau tautan gateway HTTP. Tambahkan jalur untuk membandingkan dua subfolder. Buka hasil untuk melihat CID, filter daftar berdasarkan jalur, atau pilih **Unduh JSON** untuk menyimpan perbandingan.

## Kapan jalur dianggap ditambahkan, dihapus, atau diubah?

Jalur yang hanya ada di salah satu folder ditandai sebagai ditambahkan atau dihapus. Jika seluruh subfolder ditambahkan atau dihapus, subfolder itu tampil sebagai satu jalur. Jika subfolder ada di kedua versi tetapi CID-nya berbeda, alat ini akan membandingkan jalur di dalamnya. Entri yang CID-nya berubah ditandai sebagai diubah. File yang diimpor dengan pengaturan pemotongan atau pengodean berbeda bisa memiliki CID berbeda meskipun isinya tampak sama.

## Bandingkan versi IPFS tanpa mengunduh setiap file

Browser membaca blok IPFS yang sudah diverifikasi dari gateway publik dan melewati cabang dengan CID yang sama. Dengan begitu, Anda dapat membandingkan versi situs web, set data yang sudah dipublikasikan, atau cadangan menggunakan alamat folder yang tetap untuk tiap versi. Alat ini dapat membandingkan tautan yang berubah tanpa mengunduh seluruh file. Jika entri folder tidak tersedia, hasilnya menunjukkan jalur yang tidak dapat dibandingkan.

Baca selengkapnya tentang [pengalamatan berdasarkan konten dan versi set data](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
