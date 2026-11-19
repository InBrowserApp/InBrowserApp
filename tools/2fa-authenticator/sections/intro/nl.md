## Een 2FA-code genereren uit een instelsleutel of QR-code

Open de instellingen voor tweestapsverificatie op de site die je wilt beveiligen en kies de optie voor een authenticator-app. Upload of scan de QR-code. Je kunt ook de instelsleutel of een `otpauth://`-link plakken en **Account toevoegen** kiezen. Kopieer de huidige code naar het verificatieveld van de site om de installatie af te ronden.

## Accounts uit een andere authenticator overzetten

Kies in Google Authenticator **Accounts overzetten** en exporteer de accounts die je wilt overzetten. Scan de geëxporteerde QR-codes hier met **Camera gebruiken** of upload de opgeslagen QR-afbeeldingen samen. Open in de [oorspronkelijke InBrowser.App Authenticator](https://authenticator.inbrowser.app/) **Export**, kies **Google Authenticator**, download de QR-afbeelding en upload die hier.

TOTP-accounts uit Google-overdrachtscodes worden geïmporteerd met een interval van 30 seconden. Zet accounts één voor één over om de aangepaste intervallen uit de oorspronkelijke app te behouden. Klik bij elk account op het tandwiel, klap **Key URI** uit in **Config** en plak de link hier.

Je accounts worden in deze browser opgeslagen. Download via **Accounts exporteren** een back-up voordat je sitegegevens wist of van browser wisselt. Bewaar de back-up op een veilige plek, want die bevat je instelsleutels. Kies **Back-up importeren** in het paneel om accounts toe te voegen als je het bestand wilt herstellen.

## Waarom wordt mijn verificatiecode geweigerd?

De meeste sites gebruiken tijdgebonden codes (TOTP). Controleer of je apparaat de tijd automatisch instelt. Wacht op de volgende code als de huidige bijna verloopt. Tellergebaseerde codes (HOTP) blijven gelijk tot je **Volgende code** kiest. Gebruik bij beide typen de code voor het juiste account en neem eventuele aangepaste instellingen van de site over.
