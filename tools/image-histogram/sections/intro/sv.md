## Så visar du ett bildhistogram

Välj ett foto, en skärmbild eller en illustration, eller dra och släpp filen på sidan. Histogrammet visas bredvid bilden. Du kan också prova exempelfotot. Börja med **Ljusstyrka** för att se hur tonerna fördelar sig i hela bilden. Växla sedan till **RGB** för att jämföra rött, grönt och blått på samma skala. Välj en enskild kanal för att granska den närmare.

## Så läser du av skuggor, mellantoner och högdagrar

Den vågräta axeln går från 0 (mörkast) till 255 (ljusast). Skuggorna ligger till vänster, mellantonerna i mitten och högdagrarna till höger. Ju högre stapeln är, desto fler pixlar har den nivån. För pekaren över diagrammet, tryck på det eller använd piltangenterna på nivåreglaget för att se det exakta antalet pixlar.

En topp längst ut kan tyda på att skuggor eller högdagrar är klippta. Där kan detaljer ha gått förlorade. En topp vid 255 i den röda kanalen kan till exempel avslöja klippning i just den kanalen även om ljusstyrkehistogrammet har plats kvar till höger. En helvit bakgrund kan också ge en topp. Titta på förhandsvisningen för att förstå vad toppen beror på. **Skuggor** och **Högdagrar** visar hur stor andel av de analyserade pixlarna som ligger på exakt nivå 0 respektive 255.

## När en logaritmisk skala är till hjälp

Med skalan **Linjär** är staplarnas höjd direkt proportionell mot antalet pixlar. Prova **Logaritmisk** om en stor enfärgad yta gör resten av histogrammet svårläst. Båda skalorna använder samma pixelantal för att beräkna stapelhöjden.

## Vad histogramvisaren mäter

Visaren räknar pixlarna i den 8-bitarsbild som webbläsaren återger, med bildens ursprungliga mått. Ljusstyrkan beräknas som en viktad kombination av rött, grönt och blått. Grönt väger tyngst. Helt genomskinliga pixlar hoppas över, och varje delvis genomskinlig pixel räknas en gång. När bilden återges kan de pixlarnas RGB-värden avrundas. Animerade bilder analyseras som en stillbild. Bilderna bearbetas på din enhet.
