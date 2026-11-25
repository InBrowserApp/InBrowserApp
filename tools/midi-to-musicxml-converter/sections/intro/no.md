## Gjør om MIDI til redigerbare noter

Velg en .mid- eller .midi-fil og et rutenett for kvantisering. Trykk deretter på **Last ned MusicXML**. Åpne partituret i et noteprogram som MuseScore Studio, Dorico eller Sibelius for å redigere eller skrive det ut. Du kan også åpne resultatet i [MusicXML-viseren](/no/tools/musicxml-viewer/) for å kontrollere det i nettleseren.

## Velg et rytmerutenett

MIDI registrerer når notene begynner og slutter. Når du spiller inn, kan noen noter treffe litt før eller etter taktslaget. Kvantisering flytter starten og slutten på notene til rutenettet, slik at rytmen kan noteres. Start med sekstendelsnoter (1/16). Prøv åttedelsnoter (1/8) for en enklere melodi eller trettitodelsnoter (1/32) hvis korte noter i en stemme skal holdes fra hverandre.

## Hva det konverterte partituret inneholder

Verktøyet lager MusicXML med stemmene hver for seg (partwise) fra MIDI-filer med musikalsk tidsbase (format 0 eller 1). Det grupperer stemmer og noter som spilles samtidig, og overfører tempo, taktarter og toneartsfortegn. Trommenoter i General MIDI skrives som slagverk uten bestemt tonehøyde. MIDI gir verktøyet notene og tidspunktene deres. Kontroller derfor detaljer som opptakter, trioler og andre uregelmessige notegrupper, fingersettinger og enharmonisk skrivemåte i noteprogrammet. Filen behandles lokalt i nettleseren.
