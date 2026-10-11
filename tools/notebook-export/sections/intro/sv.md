## Exportera en sparad Jupyter notebook

Öppna en IPYNB-notebook och välj HTML, Markdown eller kod. HTML och Markdown bevarar cellernas sparade ordning, inklusive sparade utmatningar som stöds. Allt stannar i din webbläsare. Ingen kärna eller körmiljö för kod eller widgetar startas.

## Välj ett användbart utdataformat

HTML ger en fristående läskopia med markerbar text, inkluderade bilder som stöds och läsbara tabeller. Markdown ger återanvändbart dokumentinnehåll; tabeller kan innehålla säker HTML och bilder använder inbäddade data-URL:er som vissa Markdown-program inte visar. Ursprunglig layout och formatering kan ändras.

Kodexport bevarar kodcellernas ordning och utelämnar Markdown, råceller och sparad utmatning. Ett identifierat notebook-språk avgör skriptets filändelse; okända språk använder TXT. Notebook-magic-kommandon och skalsyntax behålls som de är skrivna, så den exporterade koden kan kräva manuell anpassning eller den ursprungliga notebook-kärnan. En notebook utan kodceller ger en tom kodfil.

## Sparade resultat och kompatibilitet

Konverteraren läser notebook-format 4. Resultaten kommer från den sparade filen och kan vara inaktuella. Rikt innehåll som inte stöds och otillgängliga bilder markeras. Fjärrresurser hämtas inte; skript, widgetar, ljud och video körs inte. LaTeX förblir källtext, och råceller eller okända celler visas som läsbar text i dokumentexporter.

Webbläsarens resurser avgör de praktiska gränserna; det finns ingen fast gräns för filstorlek eller antal celler. Använd [Jupyter Notebook-visare](/tools/notebook-viewer/) för att granska den ursprungliga notebook-filen.
