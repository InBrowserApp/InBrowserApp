# UUID v7-generator

UUID v7 is een modern UUID-formaat dat een Unix-tijdstempel in milliseconden vooraan in de identifier plaatst en de resterende bits met willekeur vult. Daardoor zijn de waarden in de praktijk wereldwijd uniek en blijven ze tegelijk natuurlijk sorteerbaar op aanmaaktijd.

## Wat deze tool doet

Deze generator maakt UUID v7-waarden volledig in je browser. Genereer een enkele identifier of een batch van maximaal 100; kopieer de lijst daarna of download die als tekstbestand voor seeddata, databaserecords, testgegevens voor gebeurtenissen of testpayloads.

## Wanneer UUID v7 helpt

UUID v7 is handig wanneer je niet-betekenisvolle identifiers wilt die toch goed sorteren in databases, logs, wachtrijen en gedistribueerde gebeurtenisstromen. Vergeleken met willekeurige UUID v4-waarden zorgt UUID v7 voor minder indexherschikking, omdat nieuwere records meestal dicht bij het einde van een gesorteerde sleutelruimte terechtkomen.

## Opmerkingen over sorteerbaarheid en veiligheid

Het tijdstempeldeel legt milliseconden vast, geen vertrouwelijke of geheime waarde. Als een identifier de geschatte aanmaaktijd niet mag prijsgeven, gebruik dan in plaats daarvan een volledig willekeurig formaat. Binnen een gegenereerde batch houdt deze tool waarden voor dezelfde milliseconde monotoon, terwijl de UUID v7-versie- en variantbits behouden blijven.
