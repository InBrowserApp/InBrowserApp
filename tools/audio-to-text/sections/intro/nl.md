## Zo zet je een geluidsopname om in tekst

Sleep een vergaderopname, interview, college, podcast of spraakmemo naar het vak. Laat de tool de taal automatisch herkennen of kies zelf de taal van de opname. Kies een Whisper-model en klik op **Audio transcriberen**. Zodra de transcriptie klaar is, kun je op een tijdcode klikken om vanaf dat punt te luisteren. Corrigeer zo nodig namen, leestekens of verkeerd herkende woorden voordat je de tekst kopieert of downloadt.

De tool kan audioformaten lezen die je browser ondersteunt, waaronder gangbare MP3-, WAV-, M4A-, FLAC-, OGG- en WebM-bestanden. Welke codecs werken, verschilt per browser. Gaat een bestand niet open? Probeer de opname dan als WAV of MP3 te exporteren.

## Welk transcriptiemodel past bij mijn opname?

Begin met **Snel (Whisper Base)** voor een heldere spraakmemo of om snel een eerste versie te maken. **Gebalanceerd (Whisper Small)** kan bij accenten en gesprekken beter uit de voeten. **Hoogste nauwkeurigheid (Whisper Large V3 Turbo)** is het krachtigste model voor moeilijk verstaanbare audio. Het vraagt een grotere download en meer werkgeheugen. Alle drie de modellen ondersteunen meerdere talen en schrijven de opname uit in de taal die wordt gesproken.

Whisper gebruikt WebGPU als je browser en grafische hardware dat ondersteunen. De tool kan de audio ook op de CPU verwerken via WebAssembly. Bij het eerste gebruik wordt het gekozen model gedownload. De browser kan de modelbestanden die in het cachegeheugen staan opnieuw gebruiken. De downloadgrootte en verwerkingstijd hangen af van het model en het apparaat. Je opname wordt op je apparaat ingelezen en getranscribeerd. Bij het downloaden van het model wordt je opname nergens naartoe gestuurd.

## Een transcriptie met tijdcodes of ondertitels exporteren

- **TXT** geeft elk tekstfragment een begintijd. Zo verwijst `[00:02:15.320] Laten we de agenda doornemen.` naar een punt iets meer dan twee minuten na het begin van de opname. Handig voor vergadernotities, citaten uit interviews of doorzoekbare tekst.
- **SRT (SubRip)** geeft elke genummerde ondertitel een begin- en eindtijd. Dit formaat wordt veel gebruikt in videobewerkingsprogramma’s.
- **VTT (WebVTT)** geeft elke ondertitel ook een begin- en eindtijd en werkt met HTML-videospelers die ondertitelsporen ondersteunen.

Whisper schat wanneer een passage begint en eindigt. Luister belangrijke citaten terug en controleer of de ondertitels gelijklopen met de opname voordat je ze deelt. Achtergrondgeluiden en stemmen die door elkaar praten kunnen het resultaat beïnvloeden. De transcriptie is opgedeeld in tekstfragmenten op volgorde van tijd.
