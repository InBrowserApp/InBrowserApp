Verwijder beperkingen door eigenaarswachtwoorden rechtstreeks in je browser uit
een PDF. De tool maakt een nieuwe PDF zonder machtigingsvlaggen voor bewerken,
afdrukken, kopiëren of pagina-extractie.

## Wanneer je het gebruikt

Gebruik dit wanneer je al een PDF hebt die normaal opent, maar het document
gewone acties blokkeert, zoals afdrukken, tekst kopiëren, pagina's bewerken of
pagina's samenstellen in een andere PDF-tool. Dit komt vaak voor bij formulieren,
geëxporteerde rapporten, oude facturen en documenten die zijn gemaakt met
restrictieve PDF-machtigingsinstellingen.

## Hoe het werkt

Upload één PDF, controleer het geselecteerde bestand en voer daarna de
verwijderingsstap uit. De tool voert qpdf uit in een browserworker met de
PDF-bewerking `--decrypt` en geeft een nieuw PDF-bestand terug om te downloaden.
Het oorspronkelijke bestand blijft ongewijzigd, zodat je de uitvoer kunt
vergelijken of weggooien als dit niet de versie is die je nodig hebt.

## Privacy en beperkingen

De PDF blijft in deze browsersessie; hij wordt niet naar een server geüpload.
Deze tool verwijdert beperkingen door eigenaarswachtwoorden uit PDF's die al
kunnen worden geopend. Hij herstelt geen verloren gebruikers-/openwachtwoord en
kan geen beschadigde bestanden of versleutelingsmodi ontgrendelen die niet door
de browserzijdige qpdf-build worden ondersteund.
