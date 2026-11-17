## Acerca del conversor de subtítulos

Convierte archivos de subtítulos existentes entre 19 formatos de texto temporizado o exporta una transcripción en texto sin formato. Entre los usos habituales están convertir SRT a VTT para un vídeo web, pasar los diálogos de ASS o SSA a SRT, preparar subtítulos para una plataforma de vídeo y reunir varios episodios convertidos en un ZIP. La conversión se realiza en tu navegador; los archivos de subtítulos y el contenido pegado no se suben a ningún servidor.

La herramienta trabaja con el texto de los subtítulos y sus tiempos. Elige archivos o pega subtítulos, selecciona un formato de salida y revisa el resultado en la vista previa antes de descargarlo. Puedes editar el texto pegado y volver a convertirlo sin cambiar el archivo original de tu dispositivo.

## Cómo convertir subtítulos

1. Selecciona **Elegir archivos** para abrir uno o varios archivos de subtítulos, arrastra archivos al panel de entrada o pega el texto de los subtítulos en el editor. **Probar un ejemplo** carga una breve muestra SRT con dos entradas.
2. Deja **Formato de entrada** en **Detectar automáticamente** para el uso habitual. La detección examina el contenido y no se basa únicamente en el nombre del archivo. Selecciona el formato de origen manualmente si un archivo resulta ambiguo.
3. Elige un **Formato de salida**. Para una pista de subtítulos de un sitio web, elige WebVTT; para un reproductor o editor que solicite un archivo SRT, elige SubRip.
4. Abre **Opciones de conversión** cuando necesites otra codificación de archivo, una frecuencia de fotogramas o un desplazamiento de tiempo. Cambia estas opciones antes de convertir.
5. Selecciona **Convertir subtítulos**. El resultado indica los formatos de origen y de salida, el nombre del archivo de salida y el número de entradas convertidas.
6. Alterna entre **Vista previa** y **Contenido del archivo** y, después, copia el texto convertido o descarga el archivo. La tabla muestra hasta 100 entradas; el contenido del archivo y las descargas incluyen el resultado completo.

**Borrar** elimina la entrada actual y los resultados de la página. Al elegir un nuevo grupo de archivos, se sustituye la selección anterior. El conversor no guarda un historial de subtítulos, así que descarga los resultados que quieras conservar.

## Formatos compatibles y precisión de salida

Todos los formatos de la tabla admiten lectura y escritura salvo TXT, que se usa para exportar transcripciones legibles. Cada formato almacena los tiempos de manera distinta; al elegir uno de menor precisión, las marcas de tiempo se redondean a las unidades que admite.

| Formato                              | Extensión | Tiempos de salida                      |
| ------------------------------------ | --------- | -------------------------------------- |
| SubRip                               | `.srt`    | Milisegundos                           |
| WebVTT                               | `.vtt`    | Milisegundos                           |
| Advanced SubStation Alpha            | `.ass`    | Centésimas de segundo                  |
| SubStation Alpha                     | `.ssa`    | Centésimas de segundo                  |
| YouTube SubViewer                    | `.sbv`    | Milisegundos                           |
| MicroDVD                             | `.sub`    | Fotogramas de vídeo                    |
| SubViewer 2.0                        | `.sub`    | Centésimas de segundo                  |
| SAMI                                 | `.smi`    | Milisegundos                           |
| Letras LRC                           | `.lrc`    | Centésimas de segundo para los inicios |
| Timed Text                           | `.ttml`   | Milisegundos                           |
| Distribution Format Exchange Profile | `.dfxp`   | Milisegundos                           |
| YouTube SRV3                         | `.srv3`   | Milisegundos                           |
| Transcripción XML de YouTube         | `.xml`    | Segundos con precisión de milisegundos |
| MPL2                                 | `.mpl`    | Décimas de segundo                     |
| Spruce Subtitle, formato de texto    | `.stl`    | Fotogramas de vídeo                    |
| QuickTime Text                       | `.qt.txt` | Milisegundos                           |
| JSON                                 | `.json`   | Valores numéricos en milisegundos      |
| CSV                                  | `.csv`    | Valores numéricos en milisegundos      |
| TSV                                  | `.tsv`    | Valores numéricos en milisegundos      |
| Transcripción en texto, solo salida  | `.txt`    | Sin marcas de tiempo                   |

La entrada TTML también acepta archivos iTT compatibles. DFXP pertenece a la familia TTML. La exportación a TTML no reproduce todos los perfiles, diseños ni reglas de estilo específicos de cada plataforma.

Aquí, la extensión `.sub` puede corresponder a MicroDVD o SubViewer basados en texto. VobSub binario es un formato distinto. Del mismo modo, el formato `.stl` compatible es Spruce STL basado en texto, en lugar de EBU STL binario. Elige el formato por su nombre completo cuando estas extensiones resulten ambiguas.

## Elegir entre SRT, VTT, ASS y texto sin formato

**SRT** es una buena opción cuando un reproductor de vídeo, un editor o un formulario de subida solicita subtítulos SubRip. **VTT** es el formato que usan las pistas de texto de vídeo HTML y también permite incluir ajustes de entradas específicos para la web. La conversión entre ambos conserva el texto de los subtítulos y los tiempos en milisegundos, y reconstruye la sintaxis del archivo.

Una entrada SRT numerada usa una coma antes de los milisegundos:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

El mismo subtítulo en WebVTT tiene una cabecera de archivo y marcas de tiempo con punto decimal:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS y SSA** son opciones de intercambio útiles cuando la siguiente aplicación que vayas a usar los requiera. El formato de negrita, cursiva y subrayado compatible puede conservarse entre formatos que lo admitan. Las fuentes, la posición en pantalla, los comandos de dibujo, la animación de karaoke y otras funciones avanzadas de presentación se simplifican; los eventos gráficos de ASS sin diálogo legible se omiten. El conversor se centra en obtener subtítulos legibles, sin reproducir por completo la animación o el diseño originales.

**TXT** extrae el diálogo legible sin marcas de tiempo ni estilos. Su vista previa muestra el texto exportado en lugar de una tabla de tiempos. La exportación a TXT no inventa tiempos para los subtítulos, no transcribe el habla ni traduce el idioma hablado.

## Codificación de archivos y texto legible

La decodificación automática de archivos usa UTF-8, o UTF-16 cuando una marca de orden de bytes lo identifica. Para archivos antiguos, elige la codificación original si los caracteres se ven mal o el archivo no se puede decodificar. Las opciones disponibles incluyen Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS y EUC-KR, además de opciones explícitas de UTF-8 y UTF-16.

Por ejemplo, prueba GB18030 con unos subtítulos en chino que sepas que se guardaron con esa codificación, o Shift_JIS con un archivo en japonés de una aplicación antigua. La codificación cambia cómo se leen los bytes existentes; no traduce su significado. Vuelve a convertir después de seleccionar otra codificación. Los archivos de subtítulos descargados usan UTF-8, independientemente de la codificación de entrada.

## Ajustar los tiempos y la frecuencia de fotogramas

### Adelantar o retrasar todos los subtítulos

El desplazamiento de tiempo se mide en milisegundos. Un valor de `1500` retrasa todos los subtítulos 1.5 segundos; `-500` los muestra medio segundo antes. Para un subtítulo que comienza en `00:00:01.250`, esos ajustes producen `00:00:02.750` y `00:00:00.750`, respectivamente.

El desplazamiento mueve tanto el inicio como el fin y mantiene la duración hasta que alcanza el principio de la línea de tiempo. Los subtítulos desplazados por completo antes de cero se eliminan; los que cruzan parcialmente el cero comienzan en cero. Un desplazamiento corrige un retraso constante. No corrige una pista de subtítulos cuyo desfase cambia a lo largo del vídeo.

### Usar la frecuencia de fotogramas para las marcas de tiempo basadas en fotogramas

MicroDVD y Spruce STL usan fotogramas de vídeo, por lo que su frecuencia de fotogramas determina cómo se convierten los fotogramas en tiempo transcurrido. TTML también puede contener tiempos basados en fotogramas. Usa la frecuencia de fotogramas del vídeo de origen, como `23.976`, `24`, `25` o `29.97`, cuando sea necesaria para interpretar la entrada.

La frecuencia de fotogramas integrada en la entrada tiene prioridad cuando el formato la incluye. Para la salida basada en fotogramas, la opción elegida determina la frecuencia de fotogramas que se escribe. Cambiar esta opción no reajusta las marcas de tiempo habituales de SRT o VTT; cambia cómo se interpretan o escriben las marcas de tiempo basadas en fotogramas.

### Entender el redondeo y los tiempos de fin ausentes

SRT y VTT conservan la precisión de milisegundos. ASS, SSA, SubViewer y LRC redondean a centésimas; MPL2 redondea a décimas; la salida basada en fotogramas redondea a fotogramas. Un subtítulo muy breve conserva una duración positiva después del redondeo. La vista previa refleja los tiempos del formato exportado, en lugar de mostrar las marcas de tiempo de entrada sin redondear.

LRC puede proporcionar tiempos de inicio sin tiempos de fin. Cuando falta un tiempo de fin, se usa el siguiente inicio distinto, o dos segundos para el último subtítulo. La exportación a LRC no puede conservar los intervalos vacíos originales ni los tiempos de fin superpuestos, y los subtítulos de varias líneas se convierten en una sola línea de letra. QuickTime Text usa marcadores en la línea de tiempo; SAMI y QuickTime pueden reconstruir los subtítulos superpuestos como texto combinado en cada punto donde cambia el conjunto de subtítulos activos, por lo que el resultado puede contener un número distinto de segmentos.

## Conversión por lotes y descargas ZIP

Elige o arrastra varios archivos para convertirlos con el mismo formato de salida y las mismas opciones. Selecciona un resultado en el menú de nombres de archivo para revisarlo. Los archivos que no se puedan convertir conservarán su propio error, mientras que los resultados correctos seguirán disponibles para descargarlos por separado.

Cuando al menos dos archivos se convierten correctamente, **Descargar todo como ZIP** reúne esos resultados. El archivo ZIP solo contiene las conversiones correctas. Revisa los errores visibles, ajusta el formato de entrada o la codificación según corresponda y vuelve a convertir los archivos pendientes.

Los nombres de los archivos de salida conservan el nombre base del original y usan la extensión elegida: por ejemplo, `episode01.srt` se convierte en `episode01.vtt`. Si varios resultados fueran a tener el mismo nombre, un sufijo como ` (2)` permite distinguir sus entradas en el ZIP. ZIP es una opción de descarga; selecciona los propios archivos de subtítulos como entrada.

## Intercambio con JSON, CSV y TSV

JSON usa una matriz de objetos de subtítulos con valores `start` y `end` en milisegundos y una cadena `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

El lector también acepta JSON con la estructura de Whisper que contenga una matriz `segments`, donde los valores `start` y `end` de cada segmento están en segundos. Esta es una convención de entrada independiente; la exportación JSON habitual sigue usando milisegundos.

CSV y TSV usan los nombres de columna `start`, `end` y `text`. Los tiempos de entrada pueden ser valores numéricos en milisegundos o marcas de tiempo en formato de reloj. CSV encierra entre comillas los campos que contienen comas, comillas o saltos de línea; TSV usa tabulaciones entre columnas. Ambas exportaciones escriben valores numéricos en milisegundos. Usa estos formatos para pasar los subtítulos a una hoja de cálculo o a otro flujo de procesamiento de subtítulos.

## Preguntas frecuentes

### ¿Por qué la vista previa y el texto descargado se ven diferentes?

La tabla de vista previa muestra el texto legible de los subtítulos y los tiempos del formato de destino. El contenido del archivo muestra el archivo serializado real, con sus cabeceras, numeración, delimitadores y sintaxis de formato compatible. Las descargas contienen todo ese contenido serializado, incluso cuando la tabla solo muestra las primeras 100 entradas.

### ¿Por qué han cambiado los estilos o la posición?

Los formatos no comparten el mismo modelo de estilos. El formato básico compatible se conserva cuando se puede representar; los estilos avanzados, la posición de las entradas web, la animación y los metadatos de plataforma no se reproducen por completo. Usa la vista de contenido del archivo para revisar la exportación y pruébala en el reproductor o editor donde vayas a utilizarla.

### ¿Puede extraer subtítulos de un vídeo o de una pista de imágenes?

Empieza con un archivo de subtítulos de texto existente. Extrae primero del vídeo las pistas de subtítulos integradas. Las pistas PGS/SUP y VobSub/IDX basadas en imágenes necesitan OCR para convertirse en texto; EBU STL binario requiere un editor de subtítulos que pueda leer ese formato.

### ¿Dónde puedo consultar las especificaciones de los formatos?

Consulta la [especificación de WebVTT](https://www.w3.org/TR/webvtt1/), la [especificación de TTML](https://www.w3.org/TR/ttml2/) y los [formatos de subtítulos compatibles con YouTube](https://support.google.com/youtube/answer/2734698) para conocer su sintaxis de archivo y los requisitos de cada plataforma.
