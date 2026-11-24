## Så läser du en aggregerad DMARC-rapport

Öppna bilagan från en aggregerad rapport som skickats till `rua`-adressen i din DMARC-post. Visaren stöder XML, GZIP och ZIP-filer som innehåller en XML-rapport. Du kan också klistra in XML-innehållet eller läsa in exemplet. Rapportöversikten visar vem som skickade rapporten, perioden i UTC och domänens publicerade policy. Filer och inklistrad text behandlas i webbläsaren.

## Så tolkar du antalet meddelanden

Varje källpost samlar meddelanden med samma käll-IP och bedömningsresultat. En post kan motsvara flera meddelanden och samma IP-adress kan förekomma i flera poster. Totalsummorna utgår från antalet meddelanden på varje rad. Ett meddelande klarar DMARC om SPF eller DKIM är godkänt och motsvarande domän matchar den synliga From-domänen enligt DMARC:s regler. Visaren räknar ett meddelande som underkänt först när domänmatchningen misslyckas för både SPF och DKIM. Ofullständiga uppgifter om domänmatchningen visas som okända.

## Varför domänmatchning, autentisering och åtgärd kan skilja sig åt

Fäll ut Ursprungliga autentiseringsresultat för att se rapporterade domäner, resultat och DKIM-selektorer. SPF eller DKIM kan godkännas för en annan domän även om DMARC:s domänmatchning misslyckas. Mottagarens åtgärd visar hur mottagaren hanterade en grupp meddelanden. Åtgärden kan skilja sig från den publicerade policyn om mottagaren gjorde ett undantag. Filtrera på käll-IP eller From-domän för att granska en avsändare. Totalsummorna ändras inte.

## Vilka DMARC XML-format som stöds

Visaren läser aggregerade rapporter enligt RFC 9990, inklusive standardens DMARC-namnrymd, samt äldre rapporter enligt RFC 7489. RFC 9990 beskriver XML-formatet som sammanfattar autentisering och mottagarens åtgärder i aggregerade rapporter. Om e-postsystemet packar flera rapporter i samma arkiv kan du packa upp den rapport du vill granska och öppna den separat.
