## Turn MIDI into editable sheet music

Choose a .mid or .midi file, select a quantization grid, then choose **Download MusicXML**. Open the score in a notation program such as MuseScore Studio, Dorico, or Sibelius to edit or print it. You can also open the result in the [MusicXML Viewer](/tools/musicxml-viewer/) to check it in your browser.

## Choose a rhythm grid

MIDI records note timing, and a performance can land slightly ahead of or behind the beat. Quantization snaps the note starts and ends to a grid so they can be written as rhythms. Start with sixteenth notes (1/16). Try eighth notes (1/8) for a simpler melody or thirty-second notes (1/32) when the part has short notes that should stay distinct.

## What the converted score contains

The converter writes partwise MusicXML from beat-based MIDI files (format 0 or 1). It groups parts and simultaneous notes and carries over tempo, time signatures, and key signatures. General MIDI drum notes are written as unpitched percussion. MIDI gives the converter the notes and timing, so review details such as pickup bars, tuplets, fingerings, and enharmonic spelling in your notation program. The file is processed locally in the browser.
