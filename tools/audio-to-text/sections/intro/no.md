## Slik gjør du et lydopptak om til tekst

Dra et møteopptak, intervju, en forelesning, podkast eller et talenotat inn i verktøyet. La verktøyet finne språket automatisk, eller velg selv hvilket språk som snakkes i opptaket. Velg en Whisper-modell og klikk på **Transkriber lyd**. Når transkripsjonen er klar, kan du velge en tidskode for å høre den delen av opptaket. Rett opp navn, tegnsetting og ord som er feiltolket før du kopierer eller laster ned teksten.

Verktøyet leser lydformater som nettleseren din støtter, blant annet vanlige MP3-, WAV-, M4A-, FLAC-, OGG- og WebM-filer. Støtten for ulike kodeker varierer fra nettleser til nettleser. Hvis en fil ikke kan åpnes, kan du prøve å eksportere opptaket som WAV eller MP3.

## Hvilken transkripsjonsmodell bør jeg velge?

Begynn med **Rask (Whisper Base)** til tydelige talenotater eller et førsteutkast. **Balansert (Whisper Small)** kan gi bedre resultater for samtaler og ulike aksenter. **Høyest nøyaktighet (Whisper Large V3 Turbo)** er den kraftigste modellen for krevende opptak. Den trenger en større nedlasting og mer minne. Alle tre modellene støtter flere språk og transkriberer på språket som snakkes i opptaket.

Whisper bruker WebGPU når nettleseren og grafikkmaskinvaren støtter det. Verktøyet kan også behandle lyden på prosessoren via WebAssembly. Modellen du har valgt, lastes ned første gang du bruker den. Nettleseren kan gjenbruke modellfilene den har liggende i hurtigbufferen. Nedlastingsstørrelse og behandlingstid avhenger av modellen og enheten. Opptaket leses og transkriberes på enheten din. Lydopptaket sendes ikke noe sted når modellen lastes ned.

## Eksporter en transkripsjon med tidskoder eller undertekster

- **TXT** gir hvert tekstavsnitt en starttid. For eksempel viser `[00:02:15.320] La oss gå gjennom agendaen.` til en linje litt over to minutter ut i opptaket. Bruk formatet til møtenotater, intervjusitater eller søkbar tekst.
- **SRT (SubRip)** gir hver nummererte undertekst en start- og sluttid. Formatet er utbredt i videoredigeringsprogrammer.
- **VTT (WebVTT)** gir også hver undertekst en start- og sluttid og fungerer i HTML-videospillere med støtte for undertekstspor.

Whisper anslår når de enkelte delene av talen begynner og slutter. Lytt til viktige sitater på nytt og kontroller at undertekstene kommer til riktig tid før du deler dem. Bakgrunnsstøy og stemmer som snakker i munnen på hverandre, kan påvirke resultatet. Transkripsjonen er delt opp i avsnitt etter tid.
