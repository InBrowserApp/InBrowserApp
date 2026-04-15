## Qu'est-ce que la validation d'e-mail ?

La validation d'e-mail vérifie si une adresse respecte les règles syntaxiques courantes pour la partie locale, le signe `@`, les labels de domaine et le domaine de premier niveau. Elle est utile pour tester des formulaires, nettoyer des données d'exemple et repérer des fautes de frappe évidentes avant l'envoi.

### Ce que ce validateur vérifie

- Un seul `@` séparant la partie locale et le domaine
- Les limites de longueur de l'adresse complète, de la partie locale et du domaine
- Les caractères autorisés, la position des points, les règles sur les tirets et la structure du TLD
- Un résultat normalisé avec le domaine en minuscules pour faciliter la comparaison

### Exemples

- Valide : `name@example.com`
- Valide : `first.last+news@example.co.uk`
- Invalide : `name..dots@example.com`
- Invalide : `user@-example.com`

Les domaines internationalisés doivent être saisis en Punycode ASCII, par exemple `user@xn--bcher-kva.example`.

### Ce que cet outil ne vérifie pas

- Si la boîte mail existe ou peut recevoir des messages
- Les vérifications DNS, MX, SMTP ou de fournisseurs jetables
- Si un site acceptera l'adresse selon ses propres règles métier
