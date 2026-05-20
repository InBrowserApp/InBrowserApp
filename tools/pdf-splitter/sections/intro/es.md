## Qué hace esta herramienta

PDF Splitter te permite abrir un PDF en tu browser, elegir páginas por rango o
por número de página, y generar un documento más pequeño. Puedes extraer las
páginas seleccionadas en un solo PDF, dividir cada rango escrito en un PDF
separado, o dividir cada página seleccionada en su propio archivo y descargar
los resultados como un archivo ZIP.

## Casos de uso adecuados

- Extraer unas pocas páginas de un contrato, informe, manual o escaneo largo
  antes de compartirlo con otra persona.
- Separar capítulos, facturas, formularios o secciones de adjuntos en archivos
  PDF individuales.
- Quitar páginas que no necesitas antes de enviar un documento a una imprenta,
  mesa de soporte o flujo de aprobación.
- Crear divisiones repetibles con sintaxis de rangos como `1-3,5,8-10` en vez
  de hacer clic en cada página manualmente.

## Cómo funcionan los rangos de páginas

Usa números de página y rangos inclusivos separados por comas. `1-3,5,8-10`
selecciona las páginas 1, 2, 3, 5, 8, 9 y 10. Una página solo puede aparecer
una vez en la expresión, y los rangos descendentes como `7-4` se rechazan para
que el orden de salida siga siendo claro y predecible.

Para un único PDF de salida, las páginas seleccionadas se copian en un documento
nuevo en el orden mostrado por la expresión de rangos. Para varios PDF de
salida, "un archivo por rango" mantiene unido cada segmento escrito, mientras
que "un archivo por página" crea un PDF separado por cada página seleccionada.

## Notas de privacidad

El PDF se procesa localmente en tu browser y esta herramienta no lo sube. Los
enlaces de descarga generados son URL de objeto temporales que existen solo en
la pestaña actual. Revisa los archivos resultantes antes de compartirlos,
porque las páginas copiadas aún pueden contener metadatos incrustados,
anotaciones, valores de formularios o contenido oculto del documento original.

## Limitaciones

Es posible que los PDF cifrados, protegidos con contraseña o dañados no se abran
en la biblioteca PDF que se ejecuta en el browser. Este divisor copia páginas en
PDF nuevos, pero no es una herramienta visual de supresión de contenido y no
garantiza la eliminación de todos los metadatos del documento. Para supresión
legal de contenido, reparación de accesibilidad u optimización avanzada, usa un
editor de PDF dedicado después de dividirlo.
