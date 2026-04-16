## Vad ar en HTTP-statuskod?

HTTP-statuskoder ar tresiffriga svarskoder som en server returnerar for att visa vad som hande med en begaran. Du ser dem ofta i webblasarnas utvecklarverktyg, API-svar, serverloggar, uptime-kontroller och instrumentpaneler for reverse proxy.

### Sa laser du de viktigaste statuskodsgrupperna

- **1xx Informativ:** Servern har tagit emot begaran och behandlingen pagar fortfarande.
- **2xx Lyckat:** Begaran slutfordes utan problem.
- **3xx Omdirigering:** Klienten maste folja en annan plats eller ateranvanda ett cachat resultat.
- **4xx Klientfel:** Problemet finns i sjalva begaran, till exempel en saknad resurs, ogiltig indata eller misslyckad autentisering.
- **5xx Serverfel:** Servern eller ett upstream-beroende misslyckades medan en giltig begaran behandlades.

### Nar denna lookup ar anvandbar

Anvand verktyget nar du vill bekrafta betydelsen av en kod, jamfora liknande koder som 401 och 403 eller 502 och 504, eller soka efter en fras fran ett felmeddelande. Sokningen fungerar med kod, statusnamn och lokaliserad beskrivning.

### Varfor korrekt tolkning spelar roll

Vid felsokning ar statuskoden ofta den snabbaste ledtraden. Ett 4xx-svar pekar vanligen pa begaran, inloggningsuppgifter eller malresursen. Ett 5xx-svar pekar vanligen pa applikationen, gatewayen eller en upstream-tjanst. Om du forst laser kategorin blir det lattare att valja ratt nasta steg.
