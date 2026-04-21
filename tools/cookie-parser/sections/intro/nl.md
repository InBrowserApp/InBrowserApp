## Wat Het Doet

Deze tool parseert ruwe Cookie- en Set-Cookie-headers direct in je browser naar gestructureerde JSON. Je kunt één headerregel, meerdere regels of alleen waarden zonder de gebruikelijke voorvoegsels plakken.

## Cookie Vs. Set-Cookie

Een Cookie-header bevat meestal meerdere naam/waarde-paren die door de client worden verzonden. Een Set-Cookie-header definieert meestal één cookie plus attributen zoals Path, Secure, HttpOnly, SameSite, Expires of Max-Age.

## Opmerkingen

De parser draait lokaal en uploadt geen headers naar een server. Ongeldige segmenten blijven in een aparte lijst staan zodat je foutieve cookie-strings snel kunt herkennen.
