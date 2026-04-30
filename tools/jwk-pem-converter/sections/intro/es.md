## ¿Qué es la conversión JWK ↔ PEM?

JWK (JSON Web Key) es material de clave en formato JSON usado por JOSE/JWT, endpoints JWKS y configuración serverless o de navegador. Es fácil de leer para el software, pero menos aceptado por CLIs e infraestructura que esperan archivos de clave.

PEM envuelve datos de clave DER con etiquetas BEGIN/END, que es lo que suelen pedir OpenSSL, herramientas TLS, gateways de API y muchos SDKs.

Este conversor une ambos formatos localmente en tu navegador. Maneja contenedores de claves RSA, EC (P-256/384/521) y OKP, permite elegir PEM público SPKI o privado PKCS8 al partir de JWK, y puede convertir bloques PEM compatibles de vuelta a JWK JSON bonito o compacto.

Usa salida pública cuando solo necesites verificación o distribución. Las conversiones privadas muestran material de clave privada en pantalla y en descargas, así que trata el resultado como un secreto y cierra la pestaña al terminar.

- Mueve claves entre configuración JWKS/JSON y archivos PEM estilo OpenSSL.
- Extrae una clave pública antes de compartirla con verificadores JWT, gateways o clientes.
- Convierte localmente sin subir material de clave a un servidor.
