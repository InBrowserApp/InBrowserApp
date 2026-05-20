Supprimez les restrictions par mot de passe propriétaire d'un PDF directement dans votre navigateur. L'outil crée un nouveau PDF qui ne contient plus d'indicateurs d'autorisation pour la modification, l'impression, la copie ou l'extraction de pages.

## Quand l'utiliser

Utilisez-le lorsque vous avez déjà un PDF qui s'ouvre normalement, mais que le document bloque des actions courantes comme l'impression, la copie de texte, la modification de pages ou l'assemblage de pages dans un autre outil PDF. C'est fréquent avec les formulaires, les rapports exportés, les anciennes factures et les documents créés avec des paramètres de permissions PDF restrictifs.

## Fonctionnement

Importez un PDF, vérifiez le fichier sélectionné, puis lancez l'étape de suppression. L'outil exécute qpdf dans un worker de navigateur avec l'opération PDF `--decrypt` et renvoie un nouveau fichier PDF à télécharger. Le fichier d'origine reste inchangé, afin que vous puissiez comparer ou supprimer la sortie si ce n'est pas la version dont vous avez besoin.

## Confidentialité et limites

Le PDF reste dans cette session du navigateur ; il n'est pas envoyé à un serveur. Cet outil supprime les restrictions de permissions par mot de passe propriétaire des PDF qui peuvent déjà être ouverts. Il ne récupère pas un mot de passe utilisateur/d'ouverture perdu, et il ne peut pas déverrouiller les fichiers endommagés ni les modes de chiffrement non pris en charge par la version de qpdf côté navigateur.
