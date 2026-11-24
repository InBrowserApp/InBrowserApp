## How to connect a MIDI keyboard or controller

Connect a MIDI device and check that your operating system recognizes it. Select **Enable MIDI**, allow the browser’s MIDI permission if asked, and choose an input. Use a compatible browser over HTTPS. The monitor listens to the selected input and displays the messages locally.

## How to test notes and velocity

Press a key or pad and watch the piano and message log. Note On shows the note and its velocity, usually a value from 1 to 127. Note Off or a Note On with velocity 0 releases the note. The keyboard labels MIDI note 60 as C4. Change the starting octave to view a different range. Held notes are listed even when they fall outside the displayed range.

## How to inspect CC, pitch bend, and MIDI Clock

Move a knob, fader, or pedal to see its Control Change (CC) number and value. For example, many sustain pedals send CC 64. Pitch Bend is shown around a center value of 0. MIDI Clock pulses are counted separately from the message log. A standard MIDI Clock sends 24 pulses per quarter note. The log includes channel numbers and raw hex bytes for inspecting individual messages.

## Why isn't my MIDI input responding?

Check the cable, power, and device mode, and confirm that the selected port matches the controller. Close other apps that may be using the input, then reconnect it. Support depends on the browser and operating system. This tool listens to standard MIDI messages with normal MIDI access. Device-specific System Exclusive (SysEx) messages require additional permission.
