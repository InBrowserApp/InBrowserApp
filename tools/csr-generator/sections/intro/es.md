# Generador de CSR

Una solicitud de firma de certificado (CSR) es un mensaje PKCS#10 que contiene tu clave pública, los campos Subject identificativos, extensiones opcionales como Subject Alternative Names y una firma realizada con la clave privada correspondiente. Las autoridades certificadoras usan la CSR para emitir un certificado X.509 sin recibir nunca tu clave privada.

Este generador crea CSR directamente en tu navegador. Puedes generar un nuevo par de claves RSA o ECDSA, o importar una clave privada PEM sin cifrar existente cuando necesites renovar un certificado para una clave que ya está desplegada.

## Cuándo usarlo

Usa una CSR cuando necesites que una autoridad certificadora emita o renueve un certificado TLS, S/MIME, de autenticación de cliente o de servicio interno. La CSR demuestra la posesión de la clave privada y contiene la información de identidad pública que debe aparecer en el certificado.

Para certificados TLS públicos, coloca los nombres de host en Subject Alternative Names. El Common Name sigue siendo útil para legibilidad y sistemas heredados, pero los clientes modernos validan los nombres DNS y las direcciones IP desde SAN.

## Cómo generar una CSR

Elige si quieres generar una clave nueva o importar una clave privada existente. Completa los campos Subject relevantes para tu solicitud de certificado y luego agrega entradas SAN para nombres DNS, direcciones IP, direcciones de correo electrónico o URI. Genera la CSR y envía solo la CSR PEM a tu autoridad certificadora.

Si esta herramienta genera una clave nueva, descarga y guarda la clave privada antes de salir de la página. Si importas una clave, la herramienta genera solo la CSR y no vuelve a exportar la clave privada importada.

## Notas sobre claves y formato

RSA de 2048 bits es ampliamente compatible; 3072 o 4096 bits pueden ser preferibles para certificados internos de mayor duración. ECDSA P-256 es compacto y ampliamente compatible, mientras que P-384 o P-521 pueden ser necesarios por políticas más estrictas. La ruta de clave importada admite bloques PEM PKCS#8 sin cifrar, RSA PRIVATE KEY y EC PRIVATE KEY.

Las claves privadas son sensibles. No las pegues en sitios web no confiables, no las envíes a autoridades certificadoras y no las confirmes en el control de versiones. Esta herramienta se ejecuta localmente en el navegador, pero tu proceso operativo sigue necesitando almacenamiento y rotación seguros de claves.
