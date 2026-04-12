## Qu'est-ce que l'encodage URL ?

L'encodage URL (aussi appelé encodage par pourcentage) est une méthode pour convertir les caractères spéciaux en un format qui peut être transmis en toute sécurité sur internet. Les URL ne peuvent contenir que certains caractères, donc tout caractère non autorisé doit être encodé.

**Comment ça fonctionne :**

- Les caractères spéciaux sont convertis en `%` suivi de leur code ASCII hexadécimal
- Exemple : un espace devient `%20`, `{'@'}` devient `%40`
- Seules les lettres (A-Z, a-z), les chiffres (0-9) et certains symboles (- \_ . ~) n'ont pas besoin d'encodage

**Exemples courants :**

- Espace → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Pourquoi c'est nécessaire :**

- Les URL ont des caractères réservés avec des significations spéciales
- Assure que les données sont transmises correctement
- Prévient les conflits avec la structure de l'URL
- Requis pour les formulaires web et les appels d'API
