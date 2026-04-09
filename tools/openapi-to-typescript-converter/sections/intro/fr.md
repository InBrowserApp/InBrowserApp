## Qu'est-ce que le convertisseur OpenAPI vers TypeScript ?

OpenAPI to TypeScript Converter transforme un document OpenAPI 3.x en types TypeScript générés directement dans votre navigateur. C'est utile pour obtenir rapidement un aperçu des types, télécharger un fichier de déclaration ou tester en toute sécurité les options `openapi-typescript` sans envoyer votre schéma à un serveur.

## Quand l'utiliser

Utilisez cet outil si vous avez déjà un schéma OpenAPI en JSON ou YAML et que vous voulez des modèles typés de requêtes et de réponses pour des applications frontend, des prototypes de SDK ou des revues d'API. Il est particulièrement utile pour comparer les options de génération avant de valider la sortie dans votre dépôt.

## Avant de générer

Cette version pour navigateur prend en charge les documents OpenAPI 3.0 et 3.1 regroupés. Si votre schéma contient encore des cibles `$ref` externes, regroupez-les ou intégrez-les d'abord, puis générez ici la sortie TypeScript finale.
