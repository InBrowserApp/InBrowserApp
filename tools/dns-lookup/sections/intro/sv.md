DNS Lookup kontrollerar de offentliga DNS-poster som returneras för ett domännamn. Det är användbart när du verifierar lanseringen av en ny webbplats, felsöker e-postleverans, kontrollerar ändringar i CDN eller lastbalanserare, eller bekräftar om DNSSEC-relaterade svar ser olika ut mellan resolvers.

## När du ska använda det

Använd det här verktyget när du snabbt behöver ett svar i webbläsaren för vanliga DNS-posttyper. A- och AAAA-poster visar IPv4- och IPv6-destinationer, CNAME-poster visar alias, MX-poster identifierar e-postservrar, TXT-poster innehåller ofta SPF- eller verifieringstoken, och NS/SOA/CAA/SRV/HTTPS/SVCB-poster visar delegering, auktoritet, certifikat, tjänster och moderna endpoint-ledtrådar.

## Så fungerar det

Uppslagningen körs i din webbläsare med DNS over HTTPS. Välj en resolver, välj en eller flera posttyper och skicka in en domän eller URL. URL:er normaliseras till sitt värdnamn innan frågan skickas, så om du klistrar in `https://www.example.com/path` frågas `www.example.com`.

## Läsa resultat

Varje posttyp visas separat med DNS-svarskoden, resolverflaggor, svarsrader och rå JSON. `NoError` betyder att DNS-servern svarade framgångsrikt, men den kan fortfarande returnera inga svarsrader för en viss typ. `NXDomain`, `ServFail` eller `Refused` betyder vanligtvis att namnet inte finns, att resolvern inte kunde slutföra uppslagningen, eller att resolverns policy blockerade begäran.

## Integritet och begränsningar

Frågor skickas till den valda DNS over HTTPS-resolvern, inte till en InBrowser.App-server. Resolverbeteende, cacheläge, DNSSEC-validering och lokal nätverksfiltrering kan alla påverka resultaten. Det här verktyget ersätter inte auktoritativa `dig`-kontroller från flera nätverk, men det är ett snabbt sätt att granska vad offentliga DoH-resolvers returnerar från din aktuella webbläsare.
