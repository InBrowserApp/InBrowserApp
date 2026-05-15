Nätverksverktyg är en startpunkt för webbläsarbaserade nätverksuppgifter. Använd det när du vet vilken typ av problem du löser men vill ha en snabbare väg till rätt verktyg: granska ett IP-intervall, fråga DNS-poster, avkoda en internationaliserad domän, slå upp en port eller kontrollera ett certifikat eller ett SSH-nyckelfingeravtryck.

## Vad du kan göra

- Arbeta med IPv4, IPv6, CIDR-block, adressintervall och link-local-adresser härledda från MAC.
- Fråga DNS och omvända DNS-poster med webbläsarvänliga uppslagsverktyg.
- Slå upp HTTP-statuskoder, MIME-typer, portnummer och aktuell nätverkstid.
- Granska detaljer om certifikat och publika nycklar utan att skicka källmaterialet till en server.

## Välja rätt verktyg

Börja med **IP och CIDR** när indata är en adress, ett intervall, ett subnät eller ett routningsblock. Använd **DNS och domäner** för poster, PTR-uppslagningar och IDN/Punycode-konvertering. Använd **Protokollreferenser** när du behöver en snabb uppslagstabell. Använd **Nycklar och certifikat** när källmaterialet är ett TLS-certifikat, en publik nyckel eller en post med en SSH-auktoriserad nyckel.

## Integritetsanteckningar

De flesta verktyg i den här samlingen körs helt i webbläsaren. Verktyg som behöver publika nätverksdata, till exempel DNS-uppslagningar eller IP-information, kan kontakta den resolver eller uppslagstjänst som krävs för att besvara frågan. Undvik att klistra in hemligheter i publika uppslagsverktyg och föredra verktyg som bara körs lokalt för granskning av certifikat och nycklar när materialet är känsligt.
