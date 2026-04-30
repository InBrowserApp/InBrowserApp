## Wat is een cURL-converter?

Een cURL-converter zet een cURL-opdracht om naar direct bruikbare code voor veel talen en HTTP-clients. Dat is handig wanneer API-documentatie, browser-devtools of je terminalgeschiedenis al een werkend verzoek geven en je dat naar applicatiecode wilt overbrengen zonder methode, URL, headers, cookies of body handmatig opnieuw op te bouwen.

**Credit**
Mogelijk gemaakt door [curlconverter](https://curlconverter.com) van Nick Carneiro.

## Wanneer deze tool nuttig is

- Als je vertrekt vanuit een werkend cURL-voorbeeld in API-documentatie of terminalgeschiedenis.
- Als je hetzelfde verzoek wilt vergelijken tussen `fetch`, Python `requests`, Go, Java, PHP en andere doelen voordat je kiest.
- Als je snel een basis wilt genereren en daarna de foutafhandeling, retries, auth-vernieuwing en configuratie van je project wilt toevoegen.

## Wat je na de conversie moet controleren

- Controleer of het gekozen doel past bij de HTTP-bibliotheek en runtime die je project echt gebruikt.
- Lees waarschuwingen goed. Sommige shell-quotingregels, omgevingsvariabelen of niet-ondersteunde cURL-flags vragen om handmatige aanpassing.
- Vervang placeholdertokens, geheimen of voorbeeld-URL's voordat je de gegenereerde code commit.
