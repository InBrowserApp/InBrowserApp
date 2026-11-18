## ¿Cuándo conviene usar BibTeX, RIS o CSL JSON?

Elige un formato que pueda importar la aplicación en la que vas a trabajar.

- **BibTeX (`.bib`)** es una opción habitual para proyectos de LaTeX en Overleaf o en un editor local.
- **RIS (`.ris`)** sirve para trasladar referencias desde una base de datos u otro gestor bibliográfico a Zotero o EndNote.
- **CSL JSON (`.json`)** contiene datos bibliográficos estructurados para procesadores de citas y otras herramientas compatibles con los datos de Citation Style Language.

## ¿Cómo convierto y reviso mis referencias?

Pega las referencias o selecciona **Abrir archivo**. Deja **Formato de entrada** en **Detectar automáticamente** o elige el formato manualmente si falla la detección. Elige el **Formato de salida**, selecciona **Convertir y revisar** y después copia el resultado o descarga el archivo. La conversión se hace en tu navegador.

Por ejemplo, abre un archivo RIS exportado desde Zotero, elige BibTeX y descarga un archivo `.bib` para tu proyecto en Overleaf. Si solo tienes una bibliografía con formato copiada de Word, exporta primero las referencias desde el gestor bibliográfico con el que la creaste. Para importar el archivo convertido en Zotero, sigue la [guía de importación de Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## ¿Qué significa «posible duplicado»?

El informe agrupa las entradas con el mismo DOI, aunque esté escrito como enlace de `doi.org`. Si falta un DOI, también puede detectar coincidencias según el título, el año de publicación y el apellido y la inicial del nombre del primer autor. La numeración indica el orden en que se introdujeron las referencias. Selecciona **Cargar ejemplo** para ver cómo aparecen en el informe dos registros del mismo artículo. Revisa cada grupo antes de fusionar las referencias en tu gestor bibliográfico. La descarga incluye todas las entradas.

## ¿Qué campos se conservan?

Los campos comunes, como el título, los autores, el año de publicación y el DOI, suelen conservarse al cambiar de formato. Algunos campos personalizados pueden omitirse. Al generar un archivo BibTeX, se pueden asignar nuevas claves de cita para evitar conflictos. Conserva el archivo original si necesitas esos detalles. Para detectar duplicados y conservar los campos originales, elige el mismo formato de entrada y de salida.
