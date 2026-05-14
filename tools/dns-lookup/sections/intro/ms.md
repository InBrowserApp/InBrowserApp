DNS Lookup menyemak rekod DNS awam yang dikembalikan untuk nama domain. Ia berguna apabila anda mengesahkan pelancaran laman baharu, menyahpepijat penghantaran e-mel, menyemak perubahan CDN atau load balancer, atau mengesahkan sama ada respons berkaitan DNSSEC kelihatan berbeza antara penyelesai.

## Bila Digunakan

Gunakan alat ini apabila anda memerlukan jawapan pantas di sisi pelayar untuk jenis rekod DNS biasa. Rekod A dan AAAA menunjukkan destinasi IPv4 dan IPv6, rekod CNAME menunjukkan alias, rekod MX mengenal pasti penukar mel, rekod TXT sering mengandungi token SPF atau pengesahan, dan rekod NS/SOA/CAA/SRV/HTTPS/SVCB mendedahkan petunjuk delegasi, autoriti, sijil, perkhidmatan, dan endpoint moden.

## Cara Ia Berfungsi

Carian dijalankan dalam pelayar anda dengan DNS over HTTPS. Pilih penyelesai, pilih satu atau lebih jenis rekod, dan hantar domain atau URL. URL dinormalkan kepada nama hosnya sebelum kueri dihantar, jadi menampal `https://www.example.com/path` akan mengkueri `www.example.com`.

## Membaca Hasil

Setiap jenis rekod dipaparkan secara berasingan bersama kod respons DNS, bendera penyelesai, baris jawapan, dan JSON mentah. `NoError` bermaksud pelayan DNS menjawab dengan berjaya, tetapi ia masih boleh tidak mengembalikan baris jawapan untuk jenis tertentu. `NXDomain`, `ServFail`, atau `Refused` biasanya bermaksud nama tersebut tidak wujud, penyelesai tidak dapat melengkapkan carian, atau dasar penyelesai menyekat permintaan.

## Privasi dan Had

Kueri dihantar kepada penyelesai DNS over HTTPS yang dipilih, bukan kepada pelayan InBrowser.App. Tingkah laku penyelesai, keadaan cache, pengesahan DNSSEC, dan penapisan rangkaian setempat semuanya boleh mempengaruhi hasil. Alat ini tidak menggantikan semakan `dig` berautoriti daripada berbilang rangkaian, tetapi ia ialah cara pantas untuk memeriksa perkara yang dikembalikan oleh penyelesai DoH awam daripada pelayar semasa anda.
