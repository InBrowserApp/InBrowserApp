## ¿Qué es un generador de robots.txt?

Un generador de robots.txt te ayuda a crear el archivo de texto plano que indica a los rastreadores qué partes de tu sitio pueden rastrear. Combina grupos de user-agent, reglas allow/disallow, enlaces de sitemap y directivas opcionales en un archivo robots.txt listo para publicar en la raíz del sitio.

## ¿Qué puedes configurar?

Con esta herramienta puedes crear grupos de reglas separados para distintos rastreadores, aplicar ajustes predefinidos habituales, añadir una o varias URL de sitemap y definir Host o Crawl-delay cuando los rastreadores objetivo los admitan. Esto resulta útil cuando quieres reglas generales para todos los bots y restricciones más estrictas para rutas como /admin/ u otras zonas de poco valor.

## ¿Cómo deberías publicar el archivo?

Revisa la salida generada, guárdala como robots.txt y súbela al nivel superior de tu dominio, por ejemplo https://example.com/robots.txt. Después de publicarla, comprueba el archivo con tu Search Console o con herramientas de rastreo y confirma que las rutas y las URL de sitemap coinciden con la estructura real del sitio.

## ¿Cuáles son las limitaciones?

robots.txt es una instrucción de rastreo, no un sistema de control de acceso. Puede orientar a los rastreadores bien comportados, pero no protege contenido privado ni bloquea solicitudes directas, por lo que las páginas sensibles deben seguir protegidas con autenticación o autorización del lado del servidor.
