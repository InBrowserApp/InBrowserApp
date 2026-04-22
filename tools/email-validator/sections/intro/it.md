## Che cos'è la convalida e-mail?

La convalida e-mail verifica se un indirizzo segue le regole sintattiche comuni per la parte locale, il simbolo `@`, le etichette del dominio e il dominio di primo livello. È utile per testare form, ripulire dati di esempio e intercettare errori di battitura evidenti prima dell'invio.

### Cosa controlla questo validatore

- Un solo `@` che separa parte locale e dominio
- Limiti di lunghezza per indirizzo completo, parte locale e dominio
- Caratteri consentiti, posizione dei punti, regole sui trattini e struttura del TLD
- Un risultato normalizzato con il dominio in minuscolo per facilitare il confronto

### Esempi

- Valido: `name@example.com`
- Valido: `first.last+news@example.co.uk`
- Non valido: `name..dots@example.com`
- Non valido: `user@-example.com`

I domini internazionalizzati devono essere inseriti in formato Punycode ASCII, ad esempio `user@xn--bcher-kva.example`.

### Cosa questo strumento non controlla

- Se la casella esiste o può ricevere e-mail
- Controlli DNS, MX, SMTP o su provider usa e getta
- Se un sito accetterà l'indirizzo in base alle proprie regole di business
