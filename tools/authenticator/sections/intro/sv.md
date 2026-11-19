## Skapa en 2FA-kod med en konfigurationsnyckel eller QR-kod

Öppna inställningarna för tvåfaktorsautentisering på webbplatsen du vill skydda och välj alternativet för autentiseringsapp. Ladda upp eller skanna QR-koden. Du kan också klistra in konfigurationsnyckeln eller en `otpauth://`-länk och välja **Lägg till konto**. Kopiera den aktuella koden till webbplatsens verifieringsfält för att slutföra konfigurationen.

## Flytta konton från en annan autentiseringsapp

Välj **Överför konton** i Google Authenticator och exportera de konton du vill flytta. Skanna de exporterade QR-koderna här med **Använd kameran**, eller ladda upp sparade QR-bilder en i taget. Öppna **Export** i den [ursprungliga autentiseringsappen från InBrowser.App](https://authenticator.inbrowser.app/), välj **Google Authenticator**, ladda ned QR-bilden och ladda upp den här.

Dina konton sparas i den här webbläsaren. Ladda ned en säkerhetskopia via **Exportera konton** innan du rensar webbplatsdata eller byter webbläsare. Förvara säkerhetskopian på ett säkert ställe. Den innehåller dina konfigurationsnycklar.

## Varför nekas min verifieringskod?

De flesta webbplatser använder tidsbaserade koder (TOTP). Kontrollera att din enhet ställer in tiden automatiskt. Vänta på nästa kod om den aktuella snart upphör att gälla. Räknarbaserade koder (HOTP) ändras först när du väljer **Nästa kod**. För båda kodtyperna behöver du välja rätt konto och använda de inställningar som webbplatsen anger.
