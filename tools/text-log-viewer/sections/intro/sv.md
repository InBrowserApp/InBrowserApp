## Läs text och loggar lokalt

Öppna en .txt-, .text- eller .log-fil för att läsa den med radnummer, justerbar textstorlek, valfri radbrytning och fokuserad läsning. Hoppa till en rad, gå till början eller slutet eller använd Sök text för att söka i hela filen. Sökningen är exakt och skiljer på stora och små bokstäver; nästa och föregående träff söks vidare från filens andra ände när början eller slutet nås.

## Stora filer och långa rader

Läsaren visar ett avsnitt i taget för att stora filer ska vara hanterbara. Alla avsnitt är tillgängliga, även fortsättningen på mycket långa rader. Markering och webbläsarens sökkommando omfattar det aktuella avsnittet; läsarens Sök text söker i hela den avkodade filen, även efter träffar som sträcker sig över avsnittsgränser. Ingen gräns för filstorlek eller antal rader tillämpas. Webbläsarens tillgängliga minne sätter ändå en praktisk gräns.

Tomma rader, tabbar, blandade CRLF/CR/LF-radslut och Unicode-text bevaras. Radslut visas som radbrytningar. Märkkod och terminalens escape-sekvenser förblir text utan att köras. Vissa styrtecken saknar synlig symbol; filer som innehåller NUL-tecken får ett meddelande om att filen kan vara binär.

## Välj rätt teckenkodning

Automatiskt läge känner igen byteordningsmarkörer för UTF-8 och UTF-16 och använder annars strikt UTF-8. Du kan välja UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 eller Shift JIS. Ett avkodningsfel stoppar förhandsvisningen i stället för att obemärkt ersätta oläsbara tecken. Prova en annan teckenkodning om filen är oläsbar eller ser förvrängd ut; visaren kan inte avgöra varje fils ursprungliga teckenkodning.

Filer bearbetas på din enhet utan uppladdningar, externa resurser eller automatisk lagring. När du stänger eller byter fil avslutas dess lässession och resurserna frigörs. Visaren redigerar inte filer, tolkar inte HTML eller terminalkommandon och följer inte en logg i realtid.
