## Qu'est-ce qu'un convertisseur cURL ?

Un convertisseur cURL transforme une commande cURL en code prêt à l'emploi pour de nombreux langages et clients HTTP. C'est utile quand la documentation d'une API, les outils de développement du navigateur ou l'historique du terminal vous donnent déjà une requête fonctionnelle et que vous voulez la déplacer dans votre code sans reconstruire à la main la méthode, l'URL, les en-têtes, les cookies ou le corps.

**Crédit**
Propulsé par [curlconverter](https://curlconverter.com) de Nick Carneiro.

## Quand cet outil est utile

- Vous partez d'un exemple cURL déjà fonctionnel dans la documentation d'une API ou dans l'historique du terminal.
- Vous voulez comparer la même requête en `fetch`, Python `requests`, Go, Java, PHP et d'autres cibles avant d'en choisir une.
- Vous voulez générer une première base rapidement, puis ajouter la gestion d'erreurs, les retries, le rafraîchissement d'authentification et la configuration propres à votre projet.

## Ce qu'il faut vérifier après la conversion

- Vérifiez que la cible choisie correspond bien à la bibliothèque HTTP et au runtime réellement utilisés par votre projet.
- Lisez attentivement les avertissements. Certaines règles de guillemets du shell, variables d'environnement ou options cURL non prises en charge peuvent demander un ajustement manuel.
- Remplacez les jetons factices, secrets ou URL d'exemple avant de valider le code généré.
