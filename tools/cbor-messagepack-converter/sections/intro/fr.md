## Inspecter les données binaires des API

CBOR et MessagePack sont des formats de sérialisation binaires compacts pour les données structurées. Utilisez ce convertisseur pour examiner des réponses d’API, des messages WebSocket ou des valeurs en cache sous forme de JSON, ou pour créer des données binaires à partir de JSON à des fins de débogage. Tout est traité dans votre navigateur ; les entrées ne sont ni envoyées ni enregistrées.

## Encoder du JSON ou décoder des octets

Choisissez le format binaire et le sens de conversion. Pour encoder, saisissez du JSON et choisissez Hex, Base64 ou Base64URL pour la sortie. Pour décoder, collez des octets et sélectionnez leur encodage d’entrée. Changer l’encodage d’entrée réinterprète le texte déjà présent dans l’éditeur.

Ouvrez un fichier JSON pour l’encodage, ou un fichier brut `.cbor`, `.msgpack` ou `.bin` pour le décodage. Le texte encodé, par exemple en Hex ou Base64, doit être collé dans l’éditeur. Lancez la conversion, puis copiez le texte affiché ou téléchargez le résultat. Les téléchargements binaires contiennent les octets réels et peuvent être importés à nouveau.

## Préserver les valeurs et comprendre les limites

Les littéraux entiers conservent tous leurs chiffres dans la plage de 64 bits prise en charge par le format. Les valeurs que JSON ne peut pas représenter, comme les champs binaires, les tags CBOR et les extensions MessagePack, apparaissent sous forme d’enveloppes typées explicites. Activez JSON étendu pour réencoder ces enveloppes en binaire ; laissez cette option désactivée pour les objets JSON ordinaires qui utilisent fortuitement des clés d’enveloppe.

Par exemple, lorsque JSON étendu est activé, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` encode un entier exact et deux octets binaires.

Chaque conversion traite une seule valeur, avec une limite d’entrée de 1 MiB. Le compteur Octets JSON formatés mesure le JSON mis en forme affiché plutôt que l’entrée d’origine. Le réencodage préserve les valeurs prises en charge, mais peut modifier l’ordre des maps ou le choix de l’encodage binaire. Ouvrez « Formats et fidélité des types » ci-dessus pour consulter la syntaxe des enveloppes et les types non pris en charge.
