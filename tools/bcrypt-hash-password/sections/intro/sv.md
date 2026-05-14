## Vad är bcrypt?

bcrypt är en lösenordshashningsalgoritm utformad för lagring av lösenord. Den kombinerar lösenordet med ett slumpmässigt salt och upprepar resurskrävande beräkningar baserat på en kostnadsfaktor, så att angripare behöver mer tid för att testa varje gissning.

## När ska det här verktyget användas

- Generera en bcrypt-hash för ett testkonto, seed-script eller lokal utvecklingsmiljö.
- Jämför hur olika kostnadsfaktorer ändrar utdataformatet och körtiden.
- Skapa en kopieringsklar hash utan att skicka lösenordet till en server.

## Så väljer du kostnadsfaktor

Högre kostnadsvärden är långsammare och oftast säkrare, men de gör också varje inloggningsförsök långsammare för din applikation. En kostnad runt 10-12 är vanlig för interaktiva system; högre värden kan vara rimliga för arbetsflöden som bara används av administratörer eller som har låg volym. Testa kostnaden på samma typ av hårdvara som ska verifiera lösenordet.

## Att tänka på

- Varje genererad hash använder ett nytt slumpmässigt salt, så utdata ändras även när lösenordet och kostnaden är desamma.
- Lagra bcrypt-hashen, inte det ursprungliga lösenordet.
- Använd bcrypt för lösenord, inte för filkontrollsummor, signaturer eller allmän hashning.
- Håll verifieringsbeteendet konstant och undvik att avslöja om ett användarkonto finns.
