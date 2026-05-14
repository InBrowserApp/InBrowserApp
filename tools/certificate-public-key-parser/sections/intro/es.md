## What is an X.509 certificate parser?

Un certificado X.509 es un documento firmado que vincula una clave pública con una identidad, como un dominio, servicio, organización o persona. Los certificados TLS, los archivos de cadenas de certificados y muchos flujos de trabajo de S/MIME o firma usan este formato.

Este analizador lee material de certificados y claves públicas directamente en tu navegador. Puede inspeccionar bloques PEM, archivos DER binarios y texto DER en base64, y luego mostrar el sujeto, el emisor, el número de serie, el periodo de validez, el algoritmo de firma, el algoritmo de clave pública, las huellas digitales y las extensiones comunes.

Úsalo cuando necesites comparar la huella digital de un certificado, comprobar si un certificado corresponde al host esperado, inspeccionar Subject Alternative Names, confirmar el uso de clave o extraer detalles de una clave pública mientras depuras problemas de TLS y despliegue.

La herramienta no valida cadenas de confianza ni contacta con autoridades de certificación. Muestra lo que está codificado en el certificado o la clave pública que proporcionas, así que usa un escáner TLS dedicado cuando necesites validar revocación, cadena, nombre de host o un endpoint activo.

- Compara huellas digitales SHA-256 o SHA-1 antes de instalar o rotar certificados.
- Revisa SAN, uso de clave, uso extendido de clave y restricciones básicas sin subir material de certificados.
- Inspecciona claves públicas SPKI independientes cuando un servicio te proporcione solo un archivo PEM o DER de clave pública.
