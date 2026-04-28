## Maak kalenderbestanden zonder de browser te verlaten

Deze tool genereert standaard `.ics`-eventbestanden rechtstreeks in je browser. Je kunt gebeurtenissen met tijd of voor de hele dag definiëren, een tijdzonestrategie kiezen, herinneringen toevoegen en het uiteindelijke agenda-item exporteren zonder gegevens naar een server te synchroniseren.

### Waarom je het gebruikt

- Het is handig wanneer je alleen een kalenderbestand nodig hebt en niet een volledige kalenderaccountworkflow.
- Het houdt gevoelige planningen lokaal en maakt toch een standaardconforme eventbijlage.
- Je kunt herhalingsregels en herinneringen afstemmen voordat je het definitieve `.ics`-bestand downloadt.

### Aanbevolen workflow

1. Vul de samenvatting van het event, de locatie, notities en optioneel een referentie-URL in.
2. Kies het bereik van het event en beslis daarna of je `UTC`-tijdstempels exporteert of de oorspronkelijke tijdzone met `TZID` bewaart.
3. Voeg alleen herhaling en herinneringen toe als dat nodig is, download daarna het bestand en voeg het toe waar je het event deelt.

### Notities

- `UTC`-uitvoer is meestal de veiligste keuze wanneer je brede agenda-compatibiliteit wilt.
- `TZID`-uitvoer bewaart de oorspronkelijke planningscontext voor clients die benoemde tijdzones begrijpen.
- Bij evenementen voor de hele dag blijft de einddatum in het formulier inclusief, terwijl het ICS-bestand die als exclusieve einddatum opslaat.
