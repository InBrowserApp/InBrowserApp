## Omvandla domännamn mellan Unicode och Punycode

Klistra in ett domännamn som `bücher.com` i **Unicode‑domän** för att få `xn--bcher-kva.com` i **ASCII‑domän**. Klistra in en domän med `xn--` i **ASCII‑domän** för att läsa den i Unicode. Fälten uppdateras när du skriver, och du kan kopiera båda formerna.

## När de olika formerna används

Punycode återger tecken utanför ASCII i internationaliserade domännamn (IDN) med ASCII-bokstäver, siffror och bindestreck. En omvandlad del av domännamnet börjar med `xn--`. Vanliga ASCII-delar som `com` förblir oförändrade. Använd ASCII-formen när DNS-inställningar eller webbhotellet ber om den. Använd Unicode-formen för att läsa domännamnet i en logg eller konfigurationsfil.

## Vad du ska klistra in

Ange bara värdnamnet. För `https://bücher.com/catalog` klistrar du in `bücher.com`. Underdomäner fungerar också, så `www.bücher.com` blir `www.xn--bcher-kva.com`.
