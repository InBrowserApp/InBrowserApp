## ¿Qué es un CSR?

Una solicitud de firma de certificado (CSR) es un pequeño documento PKCS#10 que una autoridad de certificación (CA) necesita para emitir un certificado TLS o de firma de código. Agrupa la mitad pública de un par de claves, la identidad que deseas que la CA certifique (el Subject) y cualquier identificador adicional como nombres DNS o direcciones IP (los Subject Alternative Names, o SAN), todo firmado con la clave privada correspondiente.

Esta herramienta construye el CSR íntegramente en tu navegador usando la Web Crypto API y [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Nada relacionado con tu clave o tu solicitud se envía a ningún servidor.

## Cuándo usar esta herramienta

- Solicitar un certificado TLS a una CA pública (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, etc.) cuando su flujo de trabajo te pida pegar tu propio CSR.
- Generar un CSR para una autoridad de certificación interna — basada en ACME, smallstep, EJBCA, AD CS — sin confiar en un formulario alojado en un servidor.
- Volver a emitir un certificado con la misma clave privada importando una clave PKCS#8 PEM existente y firmando únicamente un nuevo CSR.

## Cómo rellenar el formulario

- **Origen de la clave** — elige _Generar nueva_ para crear un par de claves nuevo, o _Importar existente_ para pegar una clave PKCS#8 PEM sin cifrar. No se aceptan claves cifradas, bloques heredados `RSA PRIVATE KEY` ni `EC PRIVATE KEY`; conviértelos antes con `openssl pkcs8 -topk8 -nocrypt`.
- **Algoritmo** — RSA ofrece la mayor compatibilidad por defecto. ECDSA produce firmas más pequeñas y es ampliamente compatible con las CA modernas y los clientes TLS.
- **Subject** — la mayoría de las CA públicas ignoran todo excepto el Common Name y consideran la lista de SAN DNS como autoritativa, pero las CA privadas pueden seguir necesitando un DN completo.
- **Entradas SAN** — lista los nombres de host, IPs, direcciones de correo electrónico o URIs que quieres que cubra el certificado. Uno por línea o separados por comas.

## Aspectos importantes a tener en cuenta

- La clave privada que se muestra junto al CSR se genera de forma local y nunca sale de tu navegador. Guárdala antes de cerrar la pestaña: sin la clave privada correspondiente, el certificado firmado es inutilizable.
- Las CA públicas requieren que el Common Name (o al menos una entrada SAN) sea un nombre DNS que puedan validar. Los SAN de dirección IP son útiles principalmente para certificados internos.
- La clave privada generada no está cifrada. Añade una contraseña con `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` si la necesitas antes de almacenarla.
- Solo se admiten RSA (2048/3072/4096) y ECDSA (P-256/P-384/P-521). EdDSA se omite intencionadamente porque su aceptación en navegadores y CA sigue siendo inconsistente.
