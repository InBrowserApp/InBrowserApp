## Een MIDI-keyboard of controller aansluiten

Sluit een MIDI-apparaat aan en controleer of je besturingssysteem het herkent. Selecteer **MIDI inschakelen**, geef de browser zo nodig toestemming voor MIDI en kies een ingang. Gebruik een geschikte browser via HTTPS. De monitor luistert naar de geselecteerde ingang en toont de berichten lokaal.

## Noten en aanslagwaarden testen

Druk op een toets of pad en bekijk de piano en het logboek. Note On toont de noot en de aanslagwaarde, meestal een waarde van 1 tot 127. Note Off of een Note On met aanslagwaarde 0 laat de noot los. Het klavier geeft MIDI-noot 60 aan als C4. Wijzig het beginoctaaf om een ander bereik te bekijken. Aangehouden noten worden ook vermeld als ze buiten het weergegeven bereik vallen.

## CC, pitchbend en MIDI Clock bekijken

Beweeg een draaiknop, schuifregelaar of pedaal om het nummer en de waarde van het Control Change-bericht (CC) te zien. Veel sustainpedalen sturen bijvoorbeeld CC 64. Pitchbend wordt weergegeven rond een middenwaarde van 0. MIDI Clock-pulsen worden apart van het logboek geteld. Een standaard MIDI Clock stuurt 24 pulsen per kwartnoot. Het logboek bevat kanaalnummers en ruwe hexadecimale bytes om afzonderlijke berichten te bekijken.

## Waarom reageert mijn MIDI-ingang niet?

Controleer de kabel, voeding en apparaatmodus en ga na of de geselecteerde poort bij de controller hoort. Sluit andere apps die de ingang mogelijk gebruiken en sluit het apparaat opnieuw aan. Ondersteuning hangt af van de browser en het besturingssysteem. Deze tool luistert naar standaard MIDI-berichten met normale MIDI-toegang. Apparaatspecifieke System Exclusive-berichten (SysEx) vereisen extra toestemming.
