## Obtener un código 2FA a partir de una clave o un código QR

Abre los ajustes de autenticación de dos factores del sitio que quieres proteger y elige la opción de la aplicación de autenticación. Carga o escanea el código QR del sitio, o pega la clave de configuración o el enlace `otpauth://` y selecciona **Añadir cuenta**. Copia el código actual en el campo de verificación del sitio para completar la configuración.

## Trasladar cuentas desde otro autenticador

En Google Authenticator, selecciona **Transferir cuentas** y exporta las que quieras trasladar. Aquí puedes escanear los códigos QR de exportación con **Usar cámara** o cargar las imágenes guardadas una por una. En el [autenticador original de InBrowser.App](https://authenticator.inbrowser.app/), abre **Export**, selecciona **Google Authenticator**, descarga la imagen QR y cárgala aquí.

Las cuentas se guardan en este navegador. Descarga una copia de seguridad desde **Exportar cuentas** antes de borrar los datos del sitio o cambiar de navegador. Guárdala en privado porque contiene tus claves de configuración.

## ¿Por qué el sitio rechaza mi código de verificación?

La mayoría de los sitios usan códigos basados en la hora (TOTP). Comprueba que tu dispositivo ajuste la hora automáticamente. Si al código actual le quedan pocos segundos, espera al siguiente. Los códigos basados en un contador (HOTP) se mantienen hasta que seleccionas **Siguiente código**. En ambos casos, usa el código de la cuenta correcta y los ajustes personalizados que te indique el sitio.
