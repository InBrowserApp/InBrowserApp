## Calculer la somme de contrôle SHA-256 d’un texte ou d’un fichier

Collez un texte UTF-8 ou sélectionnez **Importer depuis un fichier** pour hacher les octets d’origine du fichier. Copiez le résultat hexadécimal pour le comparer à une somme de contrôle publiée. SHA-256 produit une empreinte de 256 bits qui s’affiche sous la forme de 64 caractères hexadécimaux.

Pour vérifier un téléchargement, calculez l’empreinte du fichier téléchargé et comparez la valeur hexadécimale dans son intégralité avec celle publiée par la source. Pour un texte, les espaces, les majuscules et les sauts de ligne modifient l’empreinte. Pour un essai rapide, le texte `abc` sans saut de ligne final donne l’empreinte suivante.

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```
