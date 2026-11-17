## Convertir une configuration d’environnement

Collez un fichier `.env` et choisissez JSON ou YAML, ou convertissez un objet JSON/YAML plat en `.env`. Importez des fichiers locaux, permutez l’entrée et la sortie, puis copiez ou téléchargez le résultat. Tout fonctionne dans votre navigateur ; la configuration n’est jamais envoyée ni enregistrée dans l’historique du navigateur ou le stockage local.

### Valeurs et guillemets

Les variables d’environnement sont des chaînes : `PORT=3000`, `DEBUG=false` et `CODE=0012` restent `"3000"`, `"false"` et `"0012"`. Les nombres et booléens JSON/YAML sont convertis en chaînes. Null, les tableaux et les objets imbriqués nécessitent une valeur chaîne explicite. Encadrez les valeurs YAML comme `0012` de guillemets lorsque leur écriture exacte compte.

Le parseur prend en charge les lignes vides, les commentaires `#`, le préfixe `export` et les guillemets simples, doubles ou inversés avec des valeurs sur plusieurs lignes. Seules les séquences `\n` et `\r` entre guillemets doubles sont interprétées. Les autres guillemets et barres obliques inverses restent littéraux, conformément au comportement courant de dotenv. Les clés utilisent des lettres, des chiffres et des traits de soulignement et ne peuvent pas commencer par un chiffre. La sortie choisit un style de guillemets qui préserve la valeur.

### Vérification de la configuration

Les clés `.env` en double affichent leurs numéros de ligne ; la dernière définition est utilisée. Les guillemets fermants manquants, le texte après les guillemets fermants et les affectations invalides affichent des erreurs avec des liens vers la ligne concernée. Les guillemets typographiques déclenchent un avertissement. Les clés JSON/YAML en double sont des erreurs.

Les commentaires, le style de guillemets d’origine et la mise en forme ne sont pas conservés. Les références comme `${NAME}` et les commandes shell restent littérales et ne sont jamais exécutées. Les chargeurs `.env` suivent des règles différentes ; cet outil applique le sous-ensemble documenté plutôt que d’interpréter des scripts shell.

Consultez la [spécification .env de Node.js](https://nodejs.org/api/environment_variables.html#dotenv) et les [règles d’analyse de dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
