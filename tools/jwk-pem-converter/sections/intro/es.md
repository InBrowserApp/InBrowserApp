## ¿Qué es la conversión JWK ↔ PEM?

JWK (JSON Web Key) es un formato JSON para claves criptográficas usado en sistemas JOSE/JWT. Puede representar claves RSA, EC u OKP y puede aparecer dentro de un JWK Set (JWKS).

PEM es una clave ASN.1/DER codificada en Base64 con encabezados como BEGIN PUBLIC KEY o BEGIN PRIVATE KEY, común en TLS, OpenSSL y muchas SDK.

Esta herramienta convierte claves en ambos sentidos, preservando el material de clave al elegir salida pública (SPKI) o privada (PKCS8). Los formatos compatibles incluyen RSA, EC (P-256/384/521) y contenedores de clave OKP, y todo se ejecuta localmente en tu navegador.

Elige JWK → PEM cuando una biblioteca, pasarela o CLI espere archivos de clave al estilo OpenSSL. Elige PEM → JWK cuando necesites incluir una clave en un JWKS, pasarla mediante configuración basada en JSON o usarla en entornos de navegador o serverless. La conversión de claves privadas conserva el material privado, así que comparte solo la salida pública cuando sea suficiente.

- Usa una clave JWK/JWKS en sistemas que solo aceptan PEM.
- Exporta claves PEM para bibliotecas JWT, pasarelas de API o distribución de claves.
- Comparte claves públicas de forma segura sin exponer datos de la clave privada.
