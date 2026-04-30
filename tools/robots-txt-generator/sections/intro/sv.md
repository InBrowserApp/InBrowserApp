## Vad är en robots.txt-generator?

En robots.txt-generator hjälper dig att skapa den enkla textfil som talar om för sökrobotar vilka delar av webbplatsen de får crawla. Den kombinerar user-agent-grupper, allow/disallow-regler, sitemap-länkar och valfria direktiv i en robots.txt-fil som är redo att publiceras i webbplatsens rot.

## Vad kan du konfigurera?

Med det här verktyget kan du skapa separata regelgrupper för olika crawlers, använda vanliga förinställningar, lägga till en eller flera sitemap-URL:er och vid behov ange Host eller Crawl-delay när målcrawlers stöder det. Det är användbart när du vill ha breda regler för alla bottar och striktare regler för sökvägar som /admin/ eller andra mindre viktiga områden.

## Hur bör du publicera filen?

Granska den genererade utdatafilen, spara den som robots.txt och ladda upp den till den högsta nivån på din domän, till exempel https://example.com/robots.txt. Efter publicering bör du testa filen med Search Console eller crawlerverktyg och kontrollera att sökvägar och sitemap-URL:er matchar strukturen på din livewebbplats.

## Vilka begränsningar finns?

robots.txt är en crawl-instruktion, inte ett system för åtkomstkontroll. Den kan vägleda välskötta crawlers, men den skyddar inte privat innehåll och blockerar inte direkta förfrågningar. Känsliga sidor bör därför fortfarande skyddas med autentisering eller auktorisering på serversidan.
