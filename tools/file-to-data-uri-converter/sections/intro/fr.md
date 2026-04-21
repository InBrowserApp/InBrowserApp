## Qu'est-ce qu'un Data URI ?

Data URI (ou data URL) intègre de petits fichiers directement dans le texte. Format : `data:[mime][;charset][;base64],data`.

**Usages courants :**

- Images ou polices en ligne dans HTML/CSS
- Stocker de petits assets dans JSON/configs

**Remarques :**

- Idéal pour de petits fichiers ; les longues chaînes peuvent ralentir la page
- Base64 est courant pour les données binaires

### Exemple

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Tout ce qui se trouve avant la virgule décrit le fichier, par exemple son type MIME et l'usage ou non de Base64. Tout ce qui se trouve après la virgule correspond à la charge encodée.

### Quand utiliser ce convertisseur

- Transformer un fichier local en chaîne intégrable dans du HTML, du CSS, du JSON ou un e-mail
- Créer une démo autonome sans héberger la ressource ailleurs
- Vérifier le type MIME détecté avant de coller le résultat dans un autre outil

### Limites pratiques

- Les Data URI sont surtout adaptés aux petits fichiers, comme les icônes, petites images ou courts extraits
- Base64 ajoute environ 33 % de surcharge, donc la chaîne finale est plus longue que le fichier d'origine
- Les chaînes très longues peuvent être pénibles à coller dans des formulaires, configurations ou éditeurs limités
