## Vad Den Gör

Det här verktyget tolkar råa Cookie- och Set-Cookie-headers till strukturerad JSON direkt i webbläsaren. Du kan klistra in en enda headerrad, flera rader eller bara värden utan de vanliga prefixen.

## Cookie Vs. Set-Cookie

En Cookie-header innehåller vanligtvis flera namn/värde-par som skickas av klienten. En Set-Cookie-header definierar vanligtvis en enda cookie tillsammans med attribut som Path, Secure, HttpOnly, SameSite, Expires eller Max-Age.

## Anteckningar

Parsern körs lokalt och laddar inte upp några headers till en server. Ogiltiga segment behålls i en separat lista så att du snabbt kan hitta felaktiga cookie-strängar.
