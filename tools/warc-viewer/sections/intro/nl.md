## Een WARC-webarchief openen

Selecteer of sleep een `.warc`- of `.warc.gz`-bestand, of open het voorbeeldarchief. De viewer maakt een lijst met archiefrecords en opent de eerste gearchiveerde HTML-pagina die hij vindt. Filter op URL of recordtype om een opname te vinden en wissel tussen het paginavoorbeeld en de recorddetails. Het indexeren van een groot archief kan even duren. Het bestand blijft in je browser.

## Opnamedatums en headers bekijken

Een Web ARChive-bestand (WARC) bevat de records die een webcrawler of archiveringstool verzamelt bij een bezoek aan een website. Meerdere records kunnen dezelfde URL hebben. Kijk naar het tijdstip van de opname in UTC en de oorspronkelijke HTTP-status om ze uit elkaar te houden. Een antwoordrecord bevat het antwoord van de server. Een verzoekrecord beschrijft wat de crawler heeft verstuurd. Een revisiterecord kan naar een andere opname verwijzen zonder de pagina opnieuw op te slaan. Je kunt deze records ook bekijken als er geen paginavoorbeeld is.

## Wat laat het paginavoorbeeld zien?

Het statische voorbeeld gebruikt de HTML en de ondersteunde afbeeldingen en stijlbladen uit hetzelfde archief. Ontbrekende bestanden kunnen de opmaak veranderen of lege plekken achterlaten. Scripts staan uit en het voorbeeld verstuurt geen verzoeken naar de oorspronkelijke website. Interactieve functies zoals inloggen en video’s afspelen zijn daardoor niet beschikbaar. De viewer ondersteunt WARC 1.0 en 1.1, inclusief met gzip gecomprimeerde records.

[Specificatie van het WARC-formaat](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
