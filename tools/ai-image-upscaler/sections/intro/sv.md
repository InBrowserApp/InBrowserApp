## Hur skalar jag upp en bild med AI?

1. Välj en JPG-, PNG- eller WebP-bild eller släpp den i rutan. Använd den bästa versionen du har, även om den är liten.
2. Välj **2×** eller **4×** och kontrollera bildens nya mått. En bild på 400 × 300 pixlar blir 800 × 600 vid 2× eller 1600 × 1200 vid 4×.
3. Välj **Skala upp bilden**. Dra sedan reglaget för att jämföra kanter och strukturer. Ladda ner resultatet som en förlustfri PNG-fil.

## Vad är superupplösning med AI?

Superupplösning ökar pixelmåtten i en lågupplöst bild. InBrowser.App använder Real-ESRGAN, en tränad modell som uppskattar finare kanter och strukturer utifrån befintliga pixlar. Det kan göra att små foton, illustrationer och komprimerade webbilder ser tydligare ut när de förstoras. Granska ansikten, liten text och fina mönster i förhandsvisningen. De nya detaljerna bygger på uppskattningar och kan skilja sig från originalmotivet.

## Ska jag välja 2× eller 4×?

Välj 2× för en måttlig förstoring, till exempel när en miniatyrbild ska användas i en större layout. Välj 4× när bilden behöver visas betydligt större, till exempel när du vill förstora en liten inskannad bild. Om du dubblar bredden och höjden får du fyra gånger så många pixlar. Fyrdubblar du båda blir det sexton gånger så många. Originalbilden får ha högst 2 048 pixlar per sida och högst 1 megapixel totalt.

## Skalas bilden upp på min enhet?

Ja. Webbläsaren laddar ner Real-ESRGAN-modellen första gången du startar en uppskalning. Bilden bearbetas på din enhet med WebGPU när det finns tillgängligt. Webbläsaren kan även använda processorn via WebAssembly. Första gången kan det ta längre tid. Bearbetningstiden beror på bildens storlek och vilken enhet du använder. Bilden stannar på din enhet hela tiden.
