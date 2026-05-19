## Hva er en tekst- eller filhash?

En hash-funksjon gjør tekst eller byteinnholdet i en fil om til en hashverdi med fast lengde. Samme inndata og algoritme gir alltid samme hashverdi, så hasher er nyttige når du trenger et repeterbart fingeravtrykk uten å laste opp private data.

## Når bør du bruke dette verktøyet

Bruk dette verktøyet til å verifisere kontrollsummer for nedlastinger, finne ut om to filer er identiske, lagre et raskt fingeravtrykk av en tekstsnutt eller feilsøke systemer som publiserer SHA-hashverdier. Når du importerer en fil, hashes byteinnholdet direkte, mens tekstmodus hasher UTF-8-teksten som vises i redigeringsfeltet.

## Velge en algoritme

SHA-256 er et solid standardvalg for nye integritetskontroller. SHA-384 og SHA-512 gir lengre SHA-2-hashverdier når et annet system forventer disse formatene. SHA-1 er inkludert for sammenligning med eldre systemer, men bør ikke brukes i nye sikkerhetssensitive løsninger.

## Personvern og begrensninger

Hashing kjøres lokalt i nettleseren din gjennom Web Crypto, og filer lastes ikke opp. En hash er ikke kryptering: den kan ikke beskytte en hemmelighet alene, og passordlagring krever en egen passordhash-funksjon med salt og arbeidsfaktor.
