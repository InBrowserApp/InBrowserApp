## Hvordan oppskalerer jeg et bilde med KI?

1. Velg et JPG-, PNG- eller WebP-bilde eller dra det inn i feltet. Bruk den beste utgaven du har, selv om den er liten.
2. Velg **2×** eller **4×**, og sjekk den nye bildestørrelsen. Et bilde på 400 × 300 piksler blir 800 × 600 ved 2× eller 1600 × 1200 ved 4×.
3. Velg **Oppskaler bildet**, og dra i glidebryteren for å sammenligne kanter og teksturer. Last ned resultatet som en tapsfri PNG-fil.

## Hva er superoppløsning med KI?

Superoppløsning øker pikselmålene i et bilde med lav oppløsning. InBrowser.App bruker Real-ESRGAN, en trent modell som anslår finere kanter og teksturer ut fra pikslene i bildet. Små fotografier, illustrasjoner og komprimerte nettbilder kan dermed se skarpere ut i større format. Se nøye på ansikter, liten skrift og fine mønstre i forhåndsvisningen. De nye detaljene er anslag og kan avvike fra originalmotivet.

## Bør jeg velge 2× eller 4×?

Velg 2× for en moderat forstørrelse, for eksempel hvis et miniatyrbilde skal få mer plass i et oppsett. Velg 4× når bildet skal vises betydelig større, for eksempel ved forstørring av et lite skannet bilde. En dobling av bredde og høyde gir fire ganger så mange piksler. Firedobler du begge, får du seksten ganger så mange. Originalbildet kan ha høyst 2 048 piksler per side og høyst 1 megapiksel til sammen.

## Oppskaleres bildet på enheten min?

Ja. Nettleseren laster ned Real-ESRGAN-modellen første gang du starter en oppskalering. Bildet behandles på enheten din med WebGPU når det er tilgjengelig. Nettleseren kan også bruke prosessoren via WebAssembly. Første oppskalering kan ta lengre tid. Behandlingstiden avhenger av bildets størrelse og enheten du bruker. Bildet blir på enheten din hele tiden.
