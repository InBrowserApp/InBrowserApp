## Appliquer un JSON Patch

Collez le document JSON d’origine dans le premier éditeur et le tableau JSON Patch RFC 6902 dans le second. Sélectionnez **Appliquer le patch** pour prévisualiser et copier le JSON modifié. Pour générer un patch, comparez les documents d’origine et modifié dans le [comparateur JSON par chemins](../json-diff-path/) et copiez le résultat **JSON Patch**. Appliquez-le au même document d’origine.

## Exemple de JSON Patch

Le document d’origine contient un statut et une étiquette.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Ce patch vérifie le statut d’origine, le modifie et ajoute une étiquette.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Le résultat est `{"status":"published","tags":["api","release"]}`.

## Opérations prises en charge et syntaxe JSON Pointer

- `add` crée ou écrase un membre d’objet, insère un élément de tableau ou remplace le document à la racine.
- `remove` supprime une valeur existante. `replace` remplace une valeur existante par une nouvelle.
- `move` prend une valeur existante au pointeur `from` et l’insère à l’emplacement `path`. `copy` insère une copie indépendante.
- `test` vérifie que la valeur à l’emplacement `path` est égale à la valeur fournie dans `value` sans modifier le document.

Les chemins respectent la syntaxe JSON Pointer (RFC 6901). Les indices de tableau commencent à zéro. Ainsi, `/tags/0` désigne la première étiquette et `/tags/-` ajoute une valeur en fin de tableau lors d’une opération d’ajout. Utilisez `~1` pour une barre oblique et `~0` pour un tilde dans une clé d’objet. Par exemple, `/a~1b` désigne la clé `a/b`. Le chemin vide `""` désigne le document entier, tandis que `/` désigne un membre dont la clé est vide.

## Pourquoi une opération JSON Patch échoue

Les opérations s’exécutent dans l’ordre du tableau, chacune sur le résultat des précédentes. Si une cible est absente, qu’un indice est hors des limites du tableau ou qu’une valeur de `test` diffère, l’outil met en évidence le premier échec et s’arrête. L’aperçu du JSON s’affiche une fois toutes les opérations réussies. Un tableau de patch vide `[]` renvoie le document d’origine.

Le patch est appliqué localement. Le JSON d’origine et le patch restent dans votre navigateur.
