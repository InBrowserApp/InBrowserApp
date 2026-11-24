## Normalisera ljudet till ett valt LUFS-värde

Jämna ut den upplevda ljudstyrkan mellan poddavsnitt, berättarröster och musikspår. Verktyget mäter den integrerade ljudstyrkan i hela inspelningen och justerar nivån lika mycket i alla kanaler. Skillnaden mellan svaga och starka partier består. Välj en förinställning eller ange det LUFS-värde som gäller för ditt projekt.

## Så normaliserar du en ljudfil

1. Välj en inspelning i mono eller stereo, eller dra den till verktyget. Vanliga format är WAV, MP3, M4A, FLAC och OGG. Vilka kodekar som fungerar beror på din webbläsare.
2. Välj en målnivå, till exempel −16 LUFS för poddar, −14 LUFS för musik eller −23 LUFS för radio och tv. Kraven varierar mellan utgivare. Ange en egen nivå om du har en leveransspecifikation.
3. Jämför mätvärdena före och efter normaliseringen, lyssna på resultatet och ladda ned en WAV-fil med 16 bitar och 48 kHz. Avkodning, analys och export sker på din enhet.

## Vad är skillnaden mellan LUFS och true peak?

Integrerad ljudstyrka i LUFS uppskattar hur stark hela inspelningen upplevs. Mätningen viktar frekvenserna och utesluter partier under en viss ljudstyrka. True peak, mätt i dBTP, uppskattar hur högt den rekonstruerade signalen kan nå mellan samplen. Två spår med liknande toppnivåer kan ha mycket olika ljudstyrka. Om du bara jämnar ut topparna kan det ena spåret fortfarande låta svagare.

## Varför är resultatet svagare än målnivån?

En kort topp kan nå gränsen på −1 dBTP innan inspelningen når den önskade ljudstyrkan. Verktyget minskar då nivåjusteringen och visar hur starkt ljudet kan bli. Om du vill ha en starkare master med samma toppmarginal kan du dämpa de högsta topparna i din ljudredigerare före normaliseringen. En ljudlös fil kan sakna mätbar integrerad ljudstyrka.
