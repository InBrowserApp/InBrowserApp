## Så ansluter du ett MIDI-keyboard eller en MIDI-kontroller

Anslut en MIDI-enhet och kontrollera att operativsystemet känner igen den. Välj **Aktivera MIDI**, ge webbläsaren MIDI-behörighet om du blir tillfrågad och välj en ingång. Använd en kompatibel webbläsare via HTTPS. Monitorn lyssnar på den valda ingången och visar meddelandena lokalt.

## Så testar du toner och anslagsvärden

Tryck på en tangent eller pad och titta på pianot och meddelandeloggen. Note On visar tonen och dess anslagsvärde, vanligtvis ett värde från 1 till 127. Note Off eller Note On med anslagsvärdet 0 släpper tonen. Klaviaturen visar MIDI-not 60 som C4. Ändra startoktaven för att visa ett annat omfång. Nedhållna toner listas även när de ligger utanför det visade omfånget.

## Så granskar du CC, pitch bend och MIDI Clock

Rör på en ratt, ett skjutreglage eller en pedal för att se numret och värdet för dess Control Change-meddelande (CC). Många sustainpedaler skickar till exempel CC 64. Pitch bend visas runt mittvärdet 0. MIDI Clock-pulser räknas separat från meddelandeloggen. En standardklocka för MIDI skickar 24 pulser per fjärdedelsnot. Loggen innehåller kanalnummer och råa hexadecimala byte för granskning av enskilda meddelanden.

## Varför svarar inte min MIDI-ingång?

Kontrollera kabeln, strömförsörjningen och enhetens läge och se till att den valda porten motsvarar kontrollern. Stäng andra appar som kan använda ingången och anslut sedan enheten igen. Stödet beror på webbläsaren och operativsystemet. Verktyget lyssnar på vanliga MIDI-meddelanden med normal MIDI-åtkomst. Enhetsspecifika System Exclusive-meddelanden (SysEx) kräver ytterligare behörighet.
