## Retrouver un contrat de stockage Filecoin à partir de son ID

Saisissez l’**ID du contrat** numérique (Deal ID) d’un contrat du Storage Market sur le réseau principal Filecoin, puis sélectionnez **Rechercher le contrat**. **Essayer un exemple** charge un enregistrement public réel pour afficher le statut, le fournisseur, le client, les dates et le Piece CID. La recherche couvre les contrats du Storage Market. Filecoin Onchain Cloud utilise un identifiant distinct pour les jeux de données.

## Comment interpréter le statut d’un contrat Filecoin

Un contrat est actif si son activation a été enregistrée et que sa date de fin prévue est encore à venir. Un contrat est en attente lorsqu’il doit encore être activé et qu’elle n’a pas dépassé son époque de début prévue. La recherche signale aussi les cas où la date de début est dépassée sans activation, le contrat a expiré ou l’état du marché enregistre une pénalité. Les époques de début et de fin proviennent de la proposition de contrat. Leurs dates UTC sont calculées à partir du calendrier des époques de la chaîne.

## Comparer le Piece CID du contrat à votre fichier

Le Piece CID est l’engagement enregistré pour la pièce Filecoin. Copiez-le pour le comparer à l’engagement calculé à partir de votre fichier local ou de votre archive CAR avec le Calculateur de Piece CID Filecoin. Le résultat affiche aussi la taille de la pièce après application du remplissage Filecoin. Un contrat vérifié porte l’indicateur de vérification Filecoin Plus.

## Retrouver d’anciens contrats Filecoin

Le navigateur consulte d’abord l’état actuel du marché sur le réseau principal Filecoin. Si un contrat ne figure plus dans cet état, l’outil peut afficher les conditions d’origine indexées par Filfox et les signale comme un enregistrement historique. Ces conditions comprennent les dates prévues et les parties au contrat. **Voir sur Filfox** ouvre l’explorateur sur le même ID de contrat.

Consultez la [référence RPC du Storage Market de Filecoin](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) pour connaître les champs renvoyés par la chaîne.
