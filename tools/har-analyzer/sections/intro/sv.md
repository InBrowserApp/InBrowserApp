## Öppna en HAR-inspelning

Exportera en HAR-fil (HTTP Archive) från webbläsarens nätverkspanel efter att ha spelat in de begäranden du vill undersöka. Öppna eller släpp filen i formatet `.har` eller `.json` här, eller ladda exemplet. Gränsen är 20 MiB och 20 000 poster.

## Hitta långsamma eller misslyckade begäranden

Sök efter URL, metod, status eller MIME-typ och sortera sedan efter starttid, varaktighet eller överförd storlek. Begäranden har samma tidsskala, mätt från den tidigaste begäran. Välj en begäran för att granska HTTP-huvuden, kakor, parametrar, meddelandekroppar och tidsfaser.

Filtret för misslyckade begäranden omfattar status 0, 4xx och 5xx. Status 0 innebär att inget HTTP-svar registrerades; filtret för 3xx omfattar 304-svar från cachen. TLS ingår i anslutningstiden.

## Läs registrerade data

Bearbetningen sker i webbläsaren. Vilka detaljer som finns tillgängliga beror på exporten. Okända storlekar räknas inte med i summorna. Inspelningens tidsintervall kan inte anges om varaktigheten saknas för någon begäran. Vattenfallsdiagrammet använder fortfarande registrerade starttider och kända sluttider.

Förhandsvisningar av meddelandekroppar bevarar den registrerade texten. Förhandsvisningar och deras kopior samt enskilda fältvärden begränsas till 100 000 tecken. Kodade meddelandekroppar förblir kodade.
