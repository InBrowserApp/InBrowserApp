## Förstå cron-scheman innan du driftsätter dem

Cron-uttryck är kompakta, men ett litet fältfel kan köra ett jobb mycket oftare, eller mycket mer sällan, än avsett. Den här parsern validerar uttrycket i din webbläsare, förklarar schemat på vanligt språk, delar upp varje fält och förhandsvisar kommande körningstider.

### När du ska använda det

- Kontrollera ett schema för driftsättning, säkerhetskopiering, rensning eller avisering innan du lägger till det på en server, i ett CI-system eller i en task runner.
- Jämför ett kopierat cron-uttryck med schemat du faktiskt förväntar dig.
- Lär ut eller felsök cron-syntax genom att ändra ett fält i taget och se hur förklaringen uppdateras.

### Format som stöds

Verktyget stöder Unix-cron-uttryck med fem standardfält: minut, timme, dag i månaden, månad och veckodag. Det accepterar också ett uttryck med sex fält med sekunder först för schemaläggare som stöder precision på sekundnivå.

### Läsa resultatet

Sammanfattningen ger en beskrivning på vanligt språk, medan fälttabellen visar hur det råa uttrycket delas upp. De kommande körningstiderna använder webbläsarens lokala tidszon, så jämför dem med tidszonen som används av schemaläggaren som ska köra jobbet.

### Anteckningar

- Veckodagsvärden använder ofta `0` eller `7` för söndag, och namn som `MON` eller `FRI` accepteras också.
- Månadsnamn som `JAN` eller `DEC` kan göra produktionsscheman enklare att granska.
- Om din schemaläggare använder en annan cron-dialekt, bekräfta specialtoken som `?`, `L`, `W` eller `#` i schemaläggarens egen dokumentation.
