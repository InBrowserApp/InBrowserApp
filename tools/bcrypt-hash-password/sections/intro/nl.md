## Wat is bcrypt?

bcrypt is een algoritme voor wachtwoordhashing dat is ontworpen voor het opslaan van wachtwoorden. Het combineert het wachtwoord met een willekeurige salt en herhaalt rekenintensief werk op basis van een costfactor, zodat aanvallers meer tijd nodig hebben om elke gok te testen.

## Wanneer gebruik je deze tool?

- Genereer een bcrypt-hash voor een testaccount, seedscript of lokale ontwikkelomgeving.
- Vergelijk hoe verschillende costfactoren de uitvoerindeling en looptijd veranderen.
- Maak een kopieerklare hash zonder het wachtwoord naar een server te sturen.

## Hoe kies je de costfactor?

Hogere costwaarden zijn trager en meestal veiliger, maar ze maken ook elke aanmeldpoging voor je applicatie trager. Een cost rond 10-12 is gebruikelijk voor interactieve systemen; hogere waarden kunnen redelijk zijn voor workflows die alleen voor beheerders zijn of weinig volume hebben. Test de cost op hetzelfde soort hardware dat het wachtwoord zal verifiëren.

## Waar moet je rekening mee houden?

- Elke gegenereerde hash gebruikt een nieuwe willekeurige salt, dus de uitvoer verandert zelfs wanneer het wachtwoord en de cost hetzelfde blijven.
- Sla de bcrypt-hash op, niet het oorspronkelijke wachtwoord.
- Gebruik bcrypt voor wachtwoorden, niet voor bestandschecksums, handtekeningen of algemene hashing.
- Houd verificatiegedrag constant en voorkom dat duidelijk wordt of een gebruikersaccount bestaat.
