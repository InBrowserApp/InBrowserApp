## Apa Itu OpenAPI To TypeScript Converter?

OpenAPI to TypeScript Converter mengubah dokumen OpenAPI 3.x menjadi tipe TypeScript yang dihasilkan langsung di browser. Ini berguna saat Anda ingin pratinjau tipe yang cepat, file deklarasi yang bisa diunduh, atau cara aman untuk mencoba opsi `openapi-typescript` tanpa mengirim skema ke server.

## Kapan Menggunakannya

Gunakan alat ini saat Anda sudah punya skema OpenAPI dalam JSON atau YAML dan ingin model request dan response bertipe untuk aplikasi frontend, prototipe SDK, atau peninjauan API. Alat ini sangat membantu untuk membandingkan opsi generasi sebelum menyimpan hasilnya ke repositori.

## Sebelum Menghasilkan

Rewrite browser ini mendukung dokumen OpenAPI 3.0 dan 3.1 yang sudah dibundle. Jika skema Anda masih memuat target `$ref` eksternal, bundle atau inline dulu, lalu hasilkan output TypeScript final di sini.
