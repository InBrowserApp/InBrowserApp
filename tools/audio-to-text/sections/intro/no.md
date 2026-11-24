## Slik gjør du et lydopptak om til tekst

Dra et møteopptak, intervju, en forelesning, podkast eller et talenotat inn i verktøyet. La verktøyet finne språket automatisk, eller velg selv hvilket språk som snakkes i opptaket. Velg en transkripsjonsmodell og klikk på **Transkriber lyd**. Når transkripsjonen er klar, kan du velge en tidskode for å høre den delen av opptaket. Rett opp navn, tegnsetting og ord som er feiltolket før du kopierer eller laster ned teksten.

Verktøyet leser lydformater som nettleseren din støtter, blant annet vanlige MP3-, WAV-, M4A-, FLAC-, OGG- og WebM-filer. Støtten for ulike kodeker varierer fra nettleser til nettleser. Hvis en fil ikke kan åpnes, kan du prøve å eksportere opptaket som WAV eller MP3.

## Hvilken transkripsjonsmodell bør jeg velge?

Bruk **Whisper Base** for tydelige opptak eller et førsteutkast. **Whisper Small** kan hjelpe med aksenter og samtaler. **Whisper Large V3 Turbo** passer for opptak med støy eller vanskelig tale, men krever en større nedlasting og mer minne. Whisper-modellene transkriberer flere språk på originalspråket. **SenseVoiceSmall** støtter mandarin, kantonesisk, engelsk, japansk og koreansk. **Qwen3-ASR 0.6B** tilbyr ren tekst eller tidskoder for avspilling og undertekster; tidskoder krever nedlasting av en ekstra modell. Ren tekst kan eksporteres som TXT.

Whisper bruker WebGPU når nettleseren og grafikkmaskinvaren støtter det. Modellen du har valgt, lastes ned første gang du bruker den. Nettleseren kan gjenbruke modellfilene den har liggende i hurtigbufferen. Nedlastingsstørrelse og behandlingstid avhenger av modellen og enheten. Opptaket leses og transkriberes på enheten din. Lydopptaket sendes ikke noe sted når modellen lastes ned. SenseVoiceSmall kjører lokalt på prosessoren via WebAssembly. Hvis WebGPU ikke er tilgjengelig, bruker Whisper prosessoren via WebAssembly.

## Eksporter en transkripsjon med tidskoder eller undertekster

- **TXT** gir hvert tekstavsnitt en starttid. For eksempel viser `[00:02:15.320] La oss gå gjennom agendaen.` til en linje litt over to minutter ut i opptaket. Bruk formatet til møtenotater, intervjusitater eller søkbar tekst.
- **SRT (SubRip)** gir hver nummererte undertekst en start- og sluttid. Formatet er utbredt i videoredigeringsprogrammer.
- **VTT (WebVTT)** gir også hver undertekst en start- og sluttid og fungerer i HTML-videospillere med støtte for undertekstspor.

Verktøyet anslår når de enkelte delene av talen begynner og slutter. Lytt til viktige sitater på nytt og kontroller at undertekstene kommer til riktig tid før du deler dem. Bakgrunnsstøy og stemmer som snakker i munnen på hverandre, kan påvirke resultatet. Transkripsjonen er delt opp i avsnitt etter tid.
