## Läs ett sparat e-postmeddelande lokalt

Öppna en EML-, Apple Mail EMLX- eller Outlook MSG-fil för att granska ämne, avsändare, mottagare, sparat datum, meddelandetext och bilagor. Använd flikarna för HTML och oformaterad text när båda alternativen finns. Fokuserat läsläge ger meddelandet mer utrymme, och textstorleken kan anpassas för långa svarstrådar.

## Integritet och säker läsning

Bearbetningen sker i din webbläsare. E-postinnehåll laddas inte upp eller sparas automatiskt. Bifogade rasterbilder som refereras med innehålls-ID kan visas i meddelandet. Fjärrbilder, typsnitt, formatmallar, aktivt innehåll och länknavigering förblir inaktiverade. Bilagor listas med namn, typer och tillgängliga storlekar. De öppnas eller körs inte, och bifogade e-postmeddelanden expanderas inte.

## Formatkompatibilitet

EML och EMLX stöder MIME-meddelanden, kodade namn och ämnesrader, vanliga teckenuppsättningar, text- och HTML-alternativ samt inkluderade bilagor. För EMLX läses meddelandedelen utifrån dess angivna antal byte; Apple Mail-metadata ignoreras. Separata bilagor från ofullständiga Apple Mail-hämtningar är inte tillgängliga. Ett ofullständigt meddelande som går att återställa kan ändå visas med en kompatibilitetsanmärkning.

MSG stöder Outlook-meddelandehuvuden, oformaterad text, HTML, information om bilagor och inkluderade rasterbilder. Meddelandetext som enbart finns i Outlooks RTF-format visas inte. Kalender- och kontaktobjekt, krypterade meddelanden och skyddad e-post stöds inte. Komplex Outlook-formatering kan skilja sig från originalprogrammet. En sparad tidsstämpel behåller sin ursprungliga tidszonstext när den finns; MSG-tidsstämplar utan datum från transporthuvudet märks uttryckligen som UTC.

När du visar ett e-postmeddelande verifieras varken avsändarens identitet eller digitala signaturer. Ett datum som saknas eller är felaktigt formaterat visas utan gissningar. Tillgängligt minne och webbläsarens funktioner avgör vilka filer som kan öppnas; det finns ingen fast gräns för filstorlek eller antal bilagor.

För en utskrivbar läskopia med sparade meddelandehuvuden och en bilagelista kan du använda [E-post till PDF-konverteraren](../email-to-pdf-converter/). Bilagornas innehåll ingår inte.

För att återanvända meddelandeinnehållet kan du använda [konverteraren från e-post till HTML/text](../email-content-export/) för HTML som fungerar offline eller kopierbar UTF-8-text, med sparade meddelandehuvuden och bilageuppgifter.

Använd [Extraheraren för e-postbilagor](/tools/email-attachment-extractor/) för att ladda ner inbäddade filer. Spara enskilda bilagor eller en ZIP-fil med valda filer, inklusive resurser i meddelandet när du väljer dem.
