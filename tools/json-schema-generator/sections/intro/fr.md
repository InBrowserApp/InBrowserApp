## Qu'est-ce que JSON Schema ?

JSON Schema est un standard pour décrire la structure de données JSON. Il permet d'exprimer les types de champs, les structures imbriquées, les clés obligatoires et des contraintes utiles à la validation.

### Ce que fait ce générateur

Collez un JSON d'exemple et l'outil déduit un schéma initial pour les objets, tableaux, nombres, booléens, valeurs null et formats de chaîne courants. Le résultat peut ensuite être copié, téléchargé et ajusté.

### Exemple

Par exemple, avec cette charge utile :

**Entrée d'exemple**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schéma généré**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Conseils

- Utilisez des données d'exemple représentatives, surtout dans les tableaux, afin de mieux déduire les champs optionnels.
- Désactivez « Infer required properties » si votre entrée n'est qu'un exemple partiel.
- Désactivez « Allow additional properties » si vous voulez un schéma plus strict par défaut.
- Gardez la détection des formats active pour reconnaître email, URI, UUID et date-time.
