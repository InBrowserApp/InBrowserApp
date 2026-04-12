## What Is Prettier Code Formatter?

Prettier Code Formatter menjalankan saluran rasmi Prettier standalone terus di
pelayar anda supaya anda boleh menyeragamkan fail sumber tanpa menghantar kod ke
pelayan. Ia berguna apabila anda perlukan pemformatan pantas, mahu membandingkan
tetapan panjang baris yang berbeza, atau memerlukan fail bersih yang boleh
disalin atau dimuat turun serta-merta.

## Supported Formats

Penulisan semula ini mengekalkan fokus pada format yang memang sudah disokong
Prettier dengan baik dalam pelayar: JavaScript, TypeScript, Flow, JSON, HTML,
CSS, SCSS, Less, Markdown, MDX, YAML, GraphQL, dan format templat berkaitan
seperti Vue dan Handlebars. Pemilih bahasa mengawal parser yang dijalankan, dan
import fail akan mengesan parser secara automatik apabila sambungannya dikenal
pasti.

## How This Rewrite Works

Penulisan semula ini memastikan logik pemformatan berat tidak berada pada laluan
UI utama. Permintaan pemformatan dibina daripada konfigurasi tempatan tool yang
bersifat tulen, kemudian dijalankan melalui saluran Prettier berasaskan worker
yang dimuatkan secara malas supaya penaipan biasa kekal responsif. Input besar
menjeda pemformatan automatik dan beralih kepada tindakan eksplisit `Format now`,
yang lebih boleh dijangka berbanding cuba memformat semula fail besar pada setiap
keystroke.
