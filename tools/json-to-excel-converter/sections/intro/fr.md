## Convertir du JSON en feuille de calcul Excel

Collez un tableau JSON ou ouvrez un fichier `.json` local, vérifiez l’aperçu, puis cliquez sur **Télécharger le XLSX**. Le convertisseur crée une feuille de calcul avec une ligne d’en-tête. Chaque objet devient une ligne et chaque champ présent dans au moins un objet devient une colonne. Vous pouvez ainsi exploiter des enregistrements d’API, des listes de produits et des exports de données. Si la réponse d’une API place les enregistrements dans un champ comme `data`, collez le tableau contenu dans ce champ.

## Développer les champs JSON imbriqués en colonnes

L’option **Développer les champs imbriqués** est activée par défaut. Par exemple, les deux enregistrements suivants donnent les colonnes `name`, `contact.city` et `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Si vous désactivez l’option, `contact` occupe une seule colonne et contient du texte JSON comme `{"city":"Oslo"}`. Dans les deux modes, chaque tableau reste dans une cellule. Le champ `tags` ne crée donc aucune ligne supplémentaire. Les champs absents ou définis sur `null` donnent des cellules vides.

## Comment Excel conserve les valeurs JSON

En règle générale, les nombres et les booléens deviennent des valeurs numériques et logiques dans Excel. Les nombres qui dépassent la précision ou la plage de valeurs d’Excel sont conservés sous forme de texte pour préserver leurs chiffres. Les chaînes JSON restent du texte. Ainsi, les identifiants comme `"00123"`, les dates écrites sous forme de chaîne et le texte commençant par `=` conservent leurs caractères d’origine.

## Prévisualiser et télécharger dans le navigateur

L’aperçu montre le début de la feuille. Le fichier XLSX téléchargé contient tous les enregistrements et toutes les colonnes. La conversion se fait dans votre navigateur et vos données JSON restent sur votre appareil. Pour un export en texte brut, utilisez le [Convertisseur JSON → CSV](../json-to-csv-converter/).
