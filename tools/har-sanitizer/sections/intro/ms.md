## Cara membersihkan fail HAR

Fail HAR (HTTP Archive) merekodkan permintaan dan respons rangkaian pelayar. Fail ini boleh mengandungi kuki sesi, token kebenaran, URL dan kandungan yang mengandungi maklumat peribadi. Gunakan alat ini untuk menyediakan salinan yang telah dibersihkan bagi tiket sokongan, laporan pepijat atau perkongsian dengan rakan sepasukan. Kaedah, kod status dan butiran masa bagi setiap permintaan dikekalkan.

1. Buka alat pembangun dalam pelayar dan pergi ke panel **Rangkaian** (Network). Ulang langkah yang mencetuskan masalah, kemudian eksport log sebagai fail HAR. Dalam Chrome, pilih **Export HAR (sanitized)** untuk mengeksport salinan yang telah membuang pengepala kelayakan standard.
2. Buka atau seret fail HAR yang dieksport ke sini. Alat ini menyediakan salinan sebaik sahaja anda memilih fail. Cuba fail contoh untuk melihat perubahan pada rakaman.
3. Semak kiraan, kemudian pilih **Muat turun HAR yang telah dibersihkan**. Nama fail baharu berakhir dengan `.sanitized.har`, dan fail itu boleh diimport ke dalam DevTools atau [Penganalisis Rangkaian HAR](/ms/tools/har-analyzer/). Pemprosesan berlaku dalam pelayar anda.

## Apakah data yang dibuang atau disamarkan?

Alat ini membuang kuki dan pengepala pengesahan yang lazim, termasuk `Authorization` dan `X-API-Key`. Secara lalai, alat ini menyamarkan nilai parameter URL serta membuang kandungan permintaan, respons dan mesej WebSocket yang direkodkan. Contohnya, `?token=example&page=2` menjadi `?token=REDACTED&page=REDACTED` dalam fail yang dieksport. Nama parameter masih tersedia untuk penyahpepijatan. Setiap medan yang diubah dikira, termasuk apabila nilai yang sama muncul dalam beberapa medan.

Matikan pilihan berkenaan apabila anda memerlukan nilai parameter atau kandungan asal untuk menghasilkan semula masalah. Nama hos, laluan URL, pengepala lain dan metadata khusus pelayar masih boleh mengandungi maklumat peribadi. Semak medan ini sebelum berkongsi fail.
