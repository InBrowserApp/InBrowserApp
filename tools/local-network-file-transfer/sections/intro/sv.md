## Så överför du filer i ditt lokala nätverk

Öppna Filöverföring i lokalt nätverk på båda enheterna när de är anslutna till samma trådlösa eller trådbundna nätverk. Välj **Skicka från den här enheten** på den första enheten. Använd kameraappen på den andra enheten för att skanna inbjudans QR-kod, eller öppna inbjudningslänken. Ett svar visas på den andra enheten. Skanna svarets QR-kod från inbjudningssidan på den första enheten, eller klistra in svarskoden där.

När enheterna är anslutna kan båda skicka en fil, en webblänk eller oformaterad text. Du kan till exempel skicka en PDF från datorn till mobilen och sedan skicka en adress tillbaka till datorn i samma session. Välj en fil eller dra den till fältet och välj **Skicka fil**. På den mottagande enheten väljer du **Ladda ner** för att spara filen eller **Kopiera text** för att använda meddelandet i en annan app.

## Vart tar filerna och texten vägen?

WebRTC krypterar data och överför dem direkt mellan de två webbläsarna. Enheterna upprättar anslutningen med hjälp av inbjudan och svaret. De innehåller anslutningsuppgifter som du bara bör dela med den du vill ansluta till. Verktyget använder ingen signaleringstjänst, uppladdningsserver eller reläserver. Håll båda sidorna öppna tills överföringen är klar.

## Om enheterna inte kan ansluta

Gästnätverk och vissa kontorsnätverk blockerar kommunikation mellan enheter, även när de använder samma wifi. Prova ett privat nätverk där enheterna kan nå varandra. Om kameran inte är tillgänglig kan du byta inbjudningslänken och svarskoden via en meddelandeapp eller en annan enhet.

## Stora filer och avbrutna överföringar

Verktyget kontrollerar filerna block för block med SHA-256 och sparar dem lokalt i den mottagande webbläsaren. Hur stora filer du kan ta emot beror på webbläsarens tillgängliga lagringsutrymme. Ladda ner varje färdigöverförd fil för att spara en kopia.

Om anslutningen bryts låter du båda de ursprungliga flikarna vara öppna och parkopplar enheterna igen. Välj **Återuppta filöverföringen** för att fortsätta från det senast kontrollerade blocket. Skanna eller klistra in den nya inbjudan i verktyget på mottagarfliken så att sidan förblir öppen.
