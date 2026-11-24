## Så ansluter du en HID-enhet i webbläsaren

Anslut en indataenhet som stöds, till exempel en spelkontroll, styrspak, pedal eller ett makrotangentbord. Välj **Anslut enhet** och välj enheten i WebHID-väljaren. Visaren visar tillverkar-ID (VID) och produkt-ID (PID), som hjälper till att identifiera maskinvaran. Använd en kompatibel webbläsare för dator via HTTPS.

## Så läser du HID-samlingar och rapport-ID

Öppna en samling för att se dess användningssida, användning och rapport-ID. Användningssidan grupperar relaterade funktioner, medan användningen identifierar en funktion inom gruppen. Indatarapporter innehåller data från enheten, utdatarapporter beskriver data som en värd kan skicka och funktionsrapporter beskriver enhetsspecifika inställningar eller tillstånd. Rapport-ID 0 betyder att gränssnittet inte använder ett uttryckligt rapport-ID.

## Så granskar du förändrade indatabyte

Flytta ett reglage i taget medan du tittar på rapporterna i hexadecimalformat i realtid. Markerade byte skiljer sig från föregående datainnehåll för samma rapport-ID. Rapport-ID visas separat från datainnehållet. Pausa insamlingen för att granska de senaste rapporterna, eller rensa listan och börja om. Slå upp enhetens rapportformat för att tolka knappar, axlar och andra fält.

## Varför visas inte min enhet eller en samling?

Kontrollera att operativsystemet känner igen enheten och öppna sedan väljaren igen. Webbläsare skyddar vanliga tangentbords- och mussamlingar, och vissa enheter gör bara en del av sina rapporter tillgängliga för webben. Visaren tar emot indatarapporter från den valda enheten och behåller data i den här fliken. För standardreglage kan du prova [Handkontrollstestaren](../gamepad-tester/) eller [Tangentbordstestaren](../keyboard-tester/).
