# Generador de claves PGP

Usa esta herramienta para crear un par de claves OpenPGP directamente en tu navegador. Produce una clave pública con armadura ASCII, una clave privada, un certificado de revocación, un ID de clave y una huella digital para que puedas configurar flujos de trabajo de correo cifrado, cifrado de archivos, firma de versiones o recuperación de cuentas sin enviar el material de clave a un servidor.

## Cuándo usarlo

Las claves PGP son útiles cuando necesitas criptografía asimétrica: otras personas usan tu clave pública para cifrar datos para ti o verificar firmas, mientras que tu clave privada descifra datos y crea firmas. Un generador basado en navegador es práctico para sesiones breves de configuración, demostraciones o flujos de trabajo locales en los que quieres obtener el resultado de inmediato.

## Cómo generar un par de claves

Introduce un nombre, un correo electrónico o ambos para que la clave tenga un ID de usuario reconocible. Añade un comentario opcional si quieres separar claves de trabajo, proyecto o firma de versiones. Elige ECC para software OpenPGP moderno, o RSA cuando necesites compatibilidad con herramientas antiguas. La frase de contraseña es opcional, pero se recomienda encarecidamente para cualquier clave privada que vayas a conservar.

## Tipos de clave y expiración

ECC usa Curve25519 y es la opción predeterminada porque es compacta y rápida. RSA está disponible en 2048, 3072 y 4096 bits para compatibilidad. La expiración se define en días; usa 0 solo para claves que administras activamente y puedes revocar. Los periodos de expiración más cortos reducen el riesgo a largo plazo y facilitan los hábitos de rotación.

## Manejo seguro de claves privadas

Descarga la clave pública, la clave privada y el certificado de revocación como archivos separados. Haz una copia de seguridad de la clave privada en un gestor de contraseñas cifrado o en almacenamiento sin conexión seguro, y guarda el certificado de revocación en otro lugar para poder retirar la clave si la clave privada se pierde o queda expuesta. Antes de publicar una clave pública, compara la huella digital por un canal de confianza.
