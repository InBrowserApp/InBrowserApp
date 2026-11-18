## Comment les champs sont déduits

Le convertisseur examine tous les éléments d’un tableau. Dans cet exemple, seul le premier enregistrement contient le champ `active`, qui devient donc facultatif. Les deux enregistrements contiennent `name`, avec une chaîne dans l’un et la valeur `null` dans l’autre. Le champ est donc obligatoire et de type `string | null`.

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

Si un tableau ne contient aucun élément dans l’exemple, le type de ses éléments est `unknown`. Pour obtenir un résultat plus représentatif, incluez des enregistrements qui illustrent les différentes structures renvoyées par votre API.

## Quand utiliser TypeScript ou Zod

Utilisez **TypeScript** pour les vérifications dans l’éditeur et à la compilation. Avec **Zod**, validez les données entrantes à l’exécution avec `apiResponseSchema.safeParse(data)`. Le fichier Zod généré exporte aussi le type TypeScript. Ajoutez les règles propres à votre API, telles que les valeurs autorisées ou les formats de chaîne, si son contrat l’exige.
