## Qu’est-ce qu’Adler-32 ?

Adler-32 est un algorithme de somme de contrôle rapide qui renvoie une valeur sur 32 bits (généralement 8 caractères hexadécimaux). Il sert à détecter des erreurs accidentelles, pas à la sécurité cryptographique.

**Points clés :**

- **Rapide et déterministe** : la même entrée produit toujours la même sortie
- **Vérification d’intégrité** : utile pour détecter les corruptions en transit ou en stockage
- **Non cryptographique** : à ne pas utiliser pour mots de passe, signatures ou anti-altération

**Usages courants :**

- Vérification de transfert de fichiers
- Vérification d’archives/packages
- Contrôles d’intégrité légers
