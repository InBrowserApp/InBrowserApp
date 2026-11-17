## Wat deze viewer laat zien

De Media-informatieviewer leest de technische metadata van lokale audio- en
videobestanden, waaronder MP4, MOV, MKV, WebM, AVI, MP3, FLAC en WAV. Gebruik de
viewer om de specificaties van een export te controleren, de taaltags van de
audiosporen van een film te bekijken of een technisch rapport te verzamelen om
problemen op te lossen. De analyse begint zodra je een bestand kiest of naar het
bestandsvak sleept.

## Details van bestanden, video, audio en ondertitels

- **Bestandsoverzicht:** het daadwerkelijke containerformaat, de bestandsgrootte,
  duur, totale bitrate, titel en het gebruikte coderingsprogramma, indien beschikbaar.
- **Videosporen:** codec, profiel en bitrate, resolutie, beeldsnelheid en
  beeldsnelheidsmodus, beeldverhouding, rotatie, bitdiepte, kleurruimte,
  chroma-subsampling en HDR-formaat.
- **Audiosporen:** codec, bitrate, taal, spoortitel, aantal kanalen en kanaalindeling,
  samplefrequentie, bitdiepte en markeringen voor standaard- of geforceerde sporen.
  Elk audiospoor wordt afzonderlijk vermeld, zodat oorspronkelijk geluid,
  nasynchronisatie en commentaarsporen van elkaar te onderscheiden blijven.
- **Ondertitelsporen:** formaat, taal, titel, duur en markeringen voor standaard- of
  geforceerde sporen, als die in het bestand zijn opgenomen.

De belangrijkste specificaties zijn meteen zichtbaar. Open **Technische details**
bij een spoor om extra velden te bekijken, of klik op de link met het aantal sporen
om naar het eerste spoor van dat type te gaan. Welke velden beschikbaar zijn, hangt
af van het formaat en de metadata.

## Een bestand inspecteren

1. Kies een lokaal audio- of videobestand, of sleep het naar het bestandsvak.
2. Bekijk het overzicht en inspecteer daarna de afzonderlijke video-, audio- en
   ondertitelsporen.
3. Kopieer het leesbare rapport voor een bericht of supportticket, of download JSON
   voor een inventaris van mediabestanden, een script of verdere analyse. Beide
   bevatten ook de technische velden die in de interface zijn ingeklapt.
4. Kies **Bestand wijzigen** om een ander bestand te inspecteren, of **Bestand
   verwijderen** om de resultaten te wissen. Als je een ander bestand selecteert
   of het huidige bestand verwijdert, stopt ook een eventueel lopende analyse.

## De getallen begrijpen

- **Container en codec beschrijven verschillende dingen.** MP4 en Matroska zijn
  containers; AVC/H.264, HEVC/H.265 en AAC beschrijven hoe streams zijn gecodeerd.
  Eén container kan meerdere audio- of ondertitelsporen bevatten.
- **De totale bitrate geldt voor het hele bestand.** Deze omvat alle streams en
  de containeroverhead. De bitrate van een spoor geldt alleen voor die stream.
  Bitrates worden weergegeven in kb/s of Mb/s; bestandsgroottes in B, KiB, MiB,
  GiB of TiB.
- **De duur bevat milliseconden.** De weergave gebruikt `HH:MM:SS.mmm`.
  Beeldsnelheid wordt weergegeven in fps en de samplefrequentie van audio in kHz.
  CFR staat voor constante beeldsnelheid; VFR voor variabele beeldsnelheid.
- **Spoormarkeringen geven aan welk spoor bedoeld is om te selecteren.** Standaard
  markeert een voorkeursspoor; geforceerd wordt vaak gebruikt voor ondertitels
  die moeten verschijnen zonder dat je een volledig ondertitelspoor selecteert.
  Dit zijn afzonderlijke markeringen die uit het bestand worden gelezen.

Sommige containers geven niet voor elke stream een afzonderlijke bitrate op.
Ontbrekende waarden worden weggelaten of als niet beschikbaar gemarkeerd; ze
worden niet afgeleid uit de bestandsnaam. Ingesloten hoesafbeeldingen tellen niet
mee als videospoor.

## Veelvoorkomende toepassingen

Controleer de resolutie en beeldsnelheid na het exporteren van een video, bekijk
de kanalen en samplefrequentie voordat je audio bewerkt, herken meerdere taal- of
commentaarsporen of verzamel codecgegevens bij het onderzoeken van een
afspeelprobleem. Met het rapport kun je de relevante specificaties delen zonder
het mediabestand te versturen.

## Lokale verwerking en rapportexport

De analyse vindt plaats in je browser: het mediabestand wordt niet geüpload en
de inhoud blijft ongewijzigd. De analysesoftware leest waar nodig delen van het
bestand en kan daardoor metadata inspecteren, ook als de browser de container
of codec niet kan afspelen.

**Rapport kopiëren** maakt een leesbare tekstsamenvatting. **JSON downloaden**
exporteert de metadata die de analysesoftware teruggeeft, samen met de
bestandsnaam en -grootte. In JSON gebruikt `Duration` seconden, gebruiken `BitRate`
en `OverallBitRate` bits per seconde en gebruikt `SamplingRate` hertz. De
interface zet deze waarden om naar beter leesbare eenheden. De export bevat ook
extra metadatavelden die niet in de spoorkaarten worden getoond.
