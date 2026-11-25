## Générer des NIV aléatoires pour les tests

Choisissez une quantité de `1` à `1000`, puis sélectionnez **Générer**. Chaque ligne contient un numéro d’identification du véhicule (NIV) à 17 caractères. Sélectionnez **Tout copier** pour coller le lot dans un formulaire de test ou une feuille de calcul, ou **Télécharger en TXT** pour enregistrer un fichier texte contenant un NIV par ligne.

## Comprendre le NIV et son chiffre de contrôle

Les trois premiers caractères forment l’identifiant du constructeur. Les caractères quatre à huit décrivent le véhicule et le neuvième est le chiffre de contrôle. Les huit derniers caractères forment la section d’identification du véhicule. Les lettres `I`, `O` et `Q` sont exclues pour éviter toute confusion avec des chiffres. Le chiffre de contrôle est calculé à partir des 16 autres caractères et peut être un chiffre de `0` à `9` ou `X`. Dans `1M8GDM9AXKP042788`, par exemple, le neuvième caractère est `X`.

## Utiliser un exemple de NIV dans un jeu de test

Utilisez les NIV générés pour tester les champs obligatoires, les importations en masse ou la validation du format et du chiffre de contrôle. Pour tester le rejet, remplacez uniquement le neuvième caractère par un autre chiffre, puis soumettez à nouveau la valeur. Le générateur produit des NIV synthétiques : les champs qui ressemblent à un constructeur, une année modèle ou un numéro de série doivent donc être considérés comme des données d’exemple. Pour l’immatriculation, la recherche de pièces ou l’historique du véhicule, utilisez le NIV inscrit sur le véhicule ou dans ses documents.
