# Wat Is AES-versleuteling?

AES is een symmetrisch versleutelingsalgoritme, wat betekent dat hetzelfde geheim wordt gebruikt om de gegevens te versleutelen en te ontsleutelen. Deze tool draait volledig in je browser en gebruikt de Web Crypto API, zodat platte tekst, wachtwoorden en geselecteerde bestanden niet worden geüpload.

De standaardmodus is AES-GCM omdat die de uitvoer versleutelt en authenticeert. Authenticatie is belangrijk: als de ciphertext, salt of IV later verandert, moet ontsleuteling mislukken in plaats van gewijzigde gegevens terug te geven. AES-CBC en AES-CTR zijn beschikbaar voor compatibiliteit, maar ze authenticeren ciphertext niet uit zichzelf.

## Wanneer Je Deze Tool Gebruikt

Gebruik deze tool wanneer je een notitie, token, configuratiefragment of klein bestand wilt beschermen voordat je het via een ander kanaal opslaat of deelt. De uitvoer is een JSON-envelope met de modus, instellingen voor sleutelafleiding, salt, IV en ciphertext, zodat die parameters bij elkaar blijven voor de bijbehorende ontsleutelstap.

Voor versleuteling op basis van een wachtwoord wordt het wachtwoord verwerkt met PBKDF2 en een willekeurige salt. Verhoog het aantal iteraties wanneer je tragere versleuteling en ontsleuteling kunt accepteren. Plak voor versleuteling met een ruwe sleutel een hexadecimale sleutel met exact de geselecteerde lengte: 32 hex-tekens voor 128-bit, 48 voor 192-bit of 64 voor 256-bit.

## Praktische Opmerkingen

Bewaar het wachtwoord of de ruwe sleutel gescheiden van de versleutelde JSON. Iedereen met zowel de JSON als het sleutelmateriaal kan de gegevens ontsleutelen. Als je een bestand versleutelt, download dan het JSON-resultaat en bewaar de oorspronkelijke bestandsnaam apart als die context belangrijk is.

Gebruik een handmatige IV niet opnieuw met dezelfde sleutel. Deze tool genereert voor elke uitvoering een nieuwe IV en salt, wat de veiligere standaard is. Geef de voorkeur aan AES-GCM, tenzij een ander systeem specifiek AES-CBC of AES-CTR vereist.
