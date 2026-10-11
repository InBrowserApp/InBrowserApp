## Een opgeslagen Jupyter-notebook exporteren

Open een IPYNB-notebook en kies HTML, Markdown of code. HTML en Markdown behouden de opgeslagen celvolgorde, inclusief ondersteunde opgeslagen uitvoer. Alles blijft in je browser. Er wordt geen kernel, code of widgetruntime gestart.

## Een bruikbaar uitvoerformaat kiezen

HTML is een zelfstandige leeskopie met selecteerbare tekst, ondersteunde opgenomen afbeeldingen en leesbare tabellen. Markdown biedt herbruikbare documentinhoud; tabellen kunnen veilige HTML bevatten en afbeeldingen gebruiken ingesloten data-URL’s, die sommige Markdown-toepassingen niet weergeven. De oorspronkelijke indeling en opmaak kunnen veranderen.

De code-export behoudt de volgorde van codecellen en laat Markdown, onbewerkte cellen en opgeslagen uitvoer weg. Een herkende notebooktaal bepaalt de scriptextensie; bij onbekende talen wordt TXT gebruikt. Notebook-magics en shellsyntaxis blijven ongewijzigd, dus de geëxporteerde code kan handmatige aanpassingen of de oorspronkelijke notebookkernel vereisen. Een notebook zonder codecellen levert een leeg codebestand op.

## Opgeslagen resultaten en compatibiliteit

De converter leest notebookformaat 4. Resultaten komen uit het opgeslagen bestand en kunnen verouderd zijn. Niet-ondersteunde rijke inhoud en niet-beschikbare afbeeldingen worden aangegeven. Externe bronnen worden niet opgehaald; scripts, widgets, audio en video worden niet uitgevoerd. LaTeX blijft brontekst en onbewerkte of onbekende cellen verschijnen als leesbare tekst in documentexports.

De beschikbare browserbronnen bepalen de praktische grenzen; er is geen vaste limiet voor de bestandsgrootte of het aantal cellen. Gebruik de [Jupyter-notebookviewer](/tools/notebook-viewer/) om het oorspronkelijke notebook te bekijken.
