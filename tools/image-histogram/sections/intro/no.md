## Slik viser du et bildehistogram

Velg et foto, et skjermbilde eller en illustrasjon, eller dra og slipp filen på siden. Histogrammet vises ved siden av bildet. Du kan også prøve eksempelbildet. Begynn med **Lysstyrke** for å se hvordan tonene fordeler seg i hele bildet. Bytt deretter til **RGB** for å sammenligne rødt, grønt og blått på samme skala. Velg én kanal for å se nærmere på den.

## Slik leser du skygger, mellomtoner og høylys

Den vannrette aksen går fra 0 (mørkest) til 255 (lysest). Skyggene ligger til venstre, mellomtonene i midten og høylysene til høyre. Jo høyere stolpen er, desto flere piksler har det nivået. Før musepekeren over diagrammet, trykk på det eller bruk piltastene på glidebryteren for å se det nøyaktige pikselantallet.

En topp ytterst kan tyde på klipping i skyggene eller høylysene, der detaljer kan ha gått tapt. En topp på 255 i den røde kanalen kan for eksempel avsløre klipping i rødkanalen selv om lysstyrkehistogrammet har plass igjen til høyre. En helt hvit bakgrunn kan også gi en slik topp. Se på forhåndsvisningen for å forstå hva toppen skyldes. **Skygger** og **Høylys** viser prosentandelen analyserte piksler på nøyaktig nivå 0 og 255, henholdsvis.

## Når en logaritmisk skala er nyttig

Med skalaen **Lineær** er stolpehøyden direkte proporsjonal med antall piksler. Prøv **Logaritmisk** hvis et stort ensfarget område gjør resten av histogrammet vanskelig å lese. Begge skalaene bruker de samme pikselantallene til å beregne stolpehøyden.

## Hva histogramviseren måler

Viseren teller pikslene i 8-bitsbildet slik nettleseren gjengir det, med de opprinnelige bildemålene. Lysstyrken beregnes som en vektet kombinasjon av rødt, grønt og blått. Grønt teller mest. Helt gjennomsiktige piksler hoppes over, og hver delvis gjennomsiktig piksel telles én gang. RGB-verdiene for slike piksler kan avrundes under gjengivelsen. Ett stillbilde fra animerte bilder blir analysert. Bildene behandles på enheten din.
