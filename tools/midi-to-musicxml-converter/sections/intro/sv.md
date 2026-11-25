## Gör om MIDI till redigerbara noter

Välj en .mid- eller .midi-fil och ett kvantiseringsrutnät. Klicka sedan på **Ladda ner MusicXML**. Öppna partituret i ett notskrivningsprogram som MuseScore Studio, Dorico eller Sibelius för att redigera eller skriva ut det. Du kan också öppna resultatet i [MusicXML-visaren](/sv/tools/musicxml-viewer/) och kontrollera det i webbläsaren.

## Välj ett rytmrutnät

MIDI registrerar när tonerna börjar och slutar. Vid inspelning kan en ton hamna lite före eller efter taktslaget. Kvantisering flyttar noternas start- och slutpunkter till rutnätet så att rytmen går att notera. Börja med sextondelsnoter (1/16). Prova åttondelsnoter (1/8) för en enklare melodi eller trettiotvåondelsnoter (1/32) om korta noter i en stämma ska vara lätta att skilja åt.

## Vad det konverterade partituret innehåller

Verktyget skapar MusicXML med stämmorna var för sig (partwise) från MIDI-filer med musikalisk tidsbas (format 0 eller 1). Det grupperar stämmor och toner som spelas samtidigt och för över tempo, taktarter och tonartsförtecken. Trumnoter i General MIDI skrivs som slagverk utan bestämd tonhöjd. MIDI ger verktyget tonerna och deras tidspositioner. Kontrollera därför detaljer som upptakter, trioler och andra oregelbundna notgrupper, fingersättningar och enharmonisk stavning i notskrivningsprogrammet. Filen bearbetas lokalt i webbläsaren.
