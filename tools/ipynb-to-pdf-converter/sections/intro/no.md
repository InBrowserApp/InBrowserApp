## Slik konverterer du en Jupyter-notatbok til PDF

Åpne eller slipp en lagret `.ipynb`-fil fra Jupyter, Google Colab eller VS Code. Kontroller forhåndsvisningen, velg A4 eller US Letter, og klikk på **Lagre som PDF**. Velg **Lagre som PDF** som utskriftsmål i nettleserens utskriftsdialog. Du kan også velge en skriver i samme dialog. Du kan for eksempel gjøre `analysis.ipynb` om til en PDF du kan legge ved en e-post eller levere sammen med en rapport.

## Dette blir med i PDF-en

PDF-en følger cellerekkefølgen i notatboken. Den tar med Markdown-overskrifter og -tabeller, kildekode og lagrede utdata som støttes, for eksempel konsolltekst, tabeller og innebygde diagrambilder. Lange kodelinjer brytes slik at de får plass på arket. Lange celler kan fortsette på neste side, og teksten kan fortsatt merkes i PDF-en.

Lagre notatboken med utdataene før du konverterer den hvis du vil ha med de nyeste resultatene. Konvertereren leser den lagrede filen lokalt uten å kjøre cellene. Kontrollprogrammer vises hvis det finnes en lagret statisk versjon. LaTeX-kilden beholdes som tekst, og eksterne bilder og andre nettressurser hentes ikke.

## Andre måter å bruke notatboken på

Bruk [Jupyter-notatbokviseren](../notebook-viewer/) til å bla i celler og lagrede utdata. Bruk [Jupyter-notatbokkonvertereren](../notebook-export/) hvis du trenger HTML, Markdown eller et kodeskript.
