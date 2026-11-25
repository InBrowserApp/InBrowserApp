## Convierte MIDI en una partitura editable

Elige un archivo .mid o .midi, selecciona una rejilla de cuantización y pulsa **Descargar MusicXML**. Abre la partitura en un editor como MuseScore Studio, Dorico o Sibelius para editarla o imprimirla. También puedes revisar el resultado en el navegador con el [Visor de partituras MusicXML](/es/tools/musicxml-viewer/).

## Cómo elegir una rejilla rítmica

MIDI registra cuándo empieza y acaba cada nota. Al tocar, algunas notas pueden caer un poco antes o después del pulso. La cuantización ajusta el inicio y el final de cada nota a la rejilla para escribir el ritmo en la partitura. Empieza con semicorcheas (1/16). Prueba con corcheas (1/8) para simplificar una melodía o con fusas (1/32) si quieres distinguir las notas breves de un pasaje.

## Qué contiene la partitura generada

El conversor genera MusicXML con estructura por partes (partwise) a partir de MIDI en formato 0 o 1 con temporización en pulsos por negra (PPQ). Organiza las partes, agrupa las notas simultáneas y conserva el tempo, las indicaciones de compás y las armaduras. Las notas de batería General MIDI se escriben como percusión de altura indeterminada. El archivo MIDI proporciona las notas y sus tiempos, así que conviene revisar la anacrusa, los grupos de valoración especial, las digitaciones y la escritura enarmónica en el editor de partituras. El archivo se procesa localmente en el navegador.
