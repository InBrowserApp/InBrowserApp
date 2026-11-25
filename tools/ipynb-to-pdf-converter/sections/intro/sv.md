## Så konverterar du en Jupyter Notebook till PDF

Öppna eller släpp en sparad `.ipynb`-fil från Jupyter, Google Colab eller VS Code. Granska förhandsvisningen, välj A4 eller US Letter och klicka på **Spara som PDF**. Välj **Spara som PDF** som destination i webbläsarens utskriftsdialogruta. Du kan även välja en skrivare i samma ruta. Du kan till exempel göra om `analysis.ipynb` till en PDF att bifoga i ett mejl eller lämna in tillsammans med en rapport.

## Det här innehåller PDF-filen

PDF-filen följer cellernas ordning i notebook-filen. Den innehåller Markdown-rubriker och -tabeller, källkod och sparade utmatningar som stöds, exempelvis konsoltext, tabeller och inbäddade diagrambilder. Långa kodrader radbryts för att rymmas på sidan. En lång cell kan fortsätta på nästa sida, och texten går att markera i PDF-filen.

Spara filen med sina utmatningar före konverteringen om du vill få med de senaste resultaten. Konverteraren läser den sparade filen lokalt och kör inga celler. Interaktiva widgetar visas om det finns en sparad statisk version. LaTeX-källkod visas som text, och bilder och andra resurser hämtas inte från externa källor.

## Andra sätt att använda filen

I [Jupyter Notebook-visaren](../notebook-viewer/) kan du bläddra mellan celler och sparade utmatningar. Använd [Jupyter Notebook-konverteraren](../notebook-export/) om du behöver HTML, Markdown eller ett skript.
