AES-dekryptering gjenoppretter klartekst fra data som er kryptert med det samme AES-nøkkelmaterialet. Dette verktøyet er laget for JSON-konvolutten som produseres av InBrowser.App AES Encryptor. Konvolutten holder algoritmen, innstillinger for nøkkelavledning, salt, IV, chiffertekst og klartekstmetadata samlet, mens passordet eller den rå nøkkelen holdes separat.

Alt arbeid skjer lokalt med nettleserens Web Crypto API. Den krypterte JSON-en, passordet, den rå nøkkelen og det dekrypterte resultatet lastes ikke opp.

## Når du bør bruke dette verktøyet

Bruk det når noen gir deg en `inbrowser-aes-v1` JSON-konvolutt, eller når du må gjenopprette et notat, token, konfigurasjonsutdrag eller en fil som du tidligere krypterte med den samsvarende AES Encryptor-siden.

Hvis konvolutten ble opprettet med et passord, skriver du inn det samme passordet, så gjenbruker verktøyet lagret PBKDF2-hash, iterasjonsantall, salt, AES-modus og nøkkellengde. Hvis konvolutten ble opprettet med en rå nøkkel, limer du inn den nøyaktige heksadesimale nøkkelen med lengden som er registrert i konvolutten.

## Praktiske merknader

AES-GCM autentiserer de krypterte dataene, så feil nøkler eller endret JSON bør feile i stedet for å returnere endret klartekst. AES-CBC og AES-CTR kan dekryptere kompatible konvolutter, men de autentiserer ikke chiffertekst alene.

Hold passordet eller den rå nøkkelen atskilt fra JSON-konvolutten. Alle som har både konvolutten og nøkkelmaterialet, kan gjenopprette klarteksten. For filkonvolutter bruker den gjenopprettede nedlastingen det opprinnelige filnavnet og medietypen som er lagret i JSON-en.
