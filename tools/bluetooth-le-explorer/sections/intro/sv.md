## Så ansluter du till en Bluetooth Low Energy-enhet

Aktivera Bluetooth och sätt enheten i ett läge där den kan anslutas. Välj **Anslut enhet** och välj din enhet i webbläsaren. Utforskaren begär åtkomst till vanliga GATT-tjänster som Battery Service, Device Information, Heart Rate och Environmental Sensing. För en anpassad GATT-tjänst anger du dess UUID innan du öppnar enhetsväljaren. Använd ett UUID på 16 bitar, till exempel `180F`, eller ett fullständigt UUID på 128 bitar från enhetens dokumentation.

## Så läser du GATT-egenskaper

Expandera en tjänst för att se dess egenskaper och vilka åtgärder de stöder. Välj **Läs** för att begära det aktuella värdet. Hexadecimal visar byten exakt som de togs emot, medan UTF-8 är användbart för egenskaper som innehåller text. En batterinivå, en mätning eller ett annat binärt värde kan behöva tolkas med hjälp av specifikationen för egenskapen.

## Så fångar du Bluetooth-aviseringar

Välj **Prenumerera** för en egenskap som stöder aviseringar eller indikationer. Uppdateringar visas med tid och egenskapens UUID. Ladda ner de senaste 100 aviseringarna som en JSON-fil för att granska dem senare, eller välj **Avsluta prenumeration** för att stoppa det flödet. Sidan behåller loggen lokalt.

## Varför kan jag inte se min enhet eller dess tjänster?

Stödet för Web Bluetooth beror på webbläsaren och operativsystemet. Använd en webbläsare som stöds via HTTPS, håll enheten i närheten och koppla från den från andra appar om den bara tillåter en anslutning. Webbläsaren ger åtkomst till godkända GATT-tjänster på Bluetooth LE-enheter. Bluetooth Classic-enheter, som hörlurar som bara erbjuder ljudprofiler, kräver ett annat gränssnitt.
