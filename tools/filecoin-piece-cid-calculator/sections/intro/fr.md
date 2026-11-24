## Calculer un Piece CID à partir d’une archive CAR ou d’un fichier

Choisissez exactement le fichier que vous comptez envoyer à un fournisseur de stockage Filecoin. Sélectionnez **Calculer le Piece CID**, puis copiez l’identifiant attendu par votre outil. Le calculateur affiche aussi la taille de la pièce après remplissage, en octets. Votre navigateur lit le fichier localement et le traite par segments. Son contenu reste sur votre appareil.

## Quel format utiliser ?

Le **Piece CID (v2)** suit la spécification [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Il commence généralement par `bafkzci` et contient les informations sur la taille des données dont les outils Filecoin récents ont besoin. Le **CommP historique (v1)** commence généralement par `baga6ea4` et sert aux contrats de stockage Filecoin traditionnels. Si votre outil demande un Piece CID historique et la taille de la pièce après remplissage, copiez l’engagement historique et utilisez la taille affichée à côté. Vous pouvez coller l’un ou l’autre format pour vérifier un engagement existant à partir de votre fichier. Des fichiers qui diffèrent uniquement par le nombre d’octets nuls à la fin peuvent produire le même CommP historique.

## Pourquoi mon CID IPFS est-il différent ?

Un CID racine IPFS identifie un bloc ou la racine d’un fichier ou d’un répertoire. Un Piece CID Filecoin est un engagement cryptographique sur les octets exacts des données à stocker, après application des règles de remplissage et de hachage de Filecoin. Si les données à stocker sont une archive CAR, calculez l’engagement à partir de l’archive elle-même. Deux archives CAR peuvent avoir le même CID racine IPFS tout en stockant les blocs dans un ordre différent, ce qui peut modifier le Piece CID. Reprenez exactement le fichier utilisé pour le calcul lorsque vous soumettez un contrat de stockage.

Consultez les règles de format et de remplissage dans la [spécification des pièces Filecoin](https://spec.filecoin.io/systems/filecoin_files/piece/).
