AES-ontsleuteling herstelt platte tekst uit gegevens die met hetzelfde AES-sleutelmateriaal zijn versleuteld. Deze tool is ontworpen voor de JSON-envelop die door de InBrowser.App AES Encryptor wordt gemaakt. De envelop bewaart het algoritme, de instellingen voor sleutelafleiding, salt, IV, ciphertext en metadata van de platte tekst bij elkaar, terwijl het wachtwoord of de ruwe sleutel apart blijft.

Al het werk gebeurt lokaal met de Web Crypto API van de browser. De versleutelde JSON, het wachtwoord, de ruwe sleutel en het ontsleutelde resultaat worden niet geüpload.

## Wanneer je deze tool gebruikt

Gebruik deze tool wanneer iemand je een `inbrowser-aes-v1` JSON-envelop geeft of wanneer je een notitie, token, configuratiefragment of bestand moet herstellen dat je eerder met de bijbehorende AES Encryptor-pagina hebt versleuteld.

Als de envelop met een wachtwoord is gemaakt, voer dan hetzelfde wachtwoord in en de tool gebruikt de opgeslagen PBKDF2-hash, het aantal iteraties, de salt, AES-modus en sleutellengte opnieuw. Als de envelop met een ruwe sleutel is gemaakt, plak dan de hexadecimale sleutel met exact de lengte die in de envelop is vastgelegd.

## Praktische opmerkingen

AES-GCM authenticeert de versleutelde gegevens, dus verkeerde sleutels of gewijzigde JSON zouden moeten mislukken in plaats van aangepaste platte tekst terug te geven. AES-CBC en AES-CTR kunnen compatibele enveloppen ontsleutelen, maar ze authenticeren ciphertext niet uit zichzelf.

Bewaar het wachtwoord of de ruwe sleutel gescheiden van de JSON-envelop. Iedereen met zowel de envelop als het sleutelmateriaal kan de platte tekst herstellen. Voor bestandsenveloppen krijgt de herstelde download de oorspronkelijke bestandsnaam en het mediatype die in de JSON zijn opgeslagen.
