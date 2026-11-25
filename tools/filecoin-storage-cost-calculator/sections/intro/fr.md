## Estimer les coûts de stockage sur Filecoin Onchain Cloud

Indiquez la taille des données, la **Durée de conservation (jours)** et le nombre de **Copies**. Le calculateur estime le coût de stockage d’un nouveau jeu de données par copie avec Filecoin Warm Storage Service. Il affiche le tarif mensuel du stockage et de la production de preuves, les dépenses pour la période sélectionnée et les frais de création des jeux de données et d’ajout de pièces. Les montants sont exprimés en USDFC. Pour Filecoin, un mois de facturation compte 30 jours.

## Comment l’estimation du stockage est calculée

Chaque jeu de données actif est facturé selon sa taille, avec un forfait pour la preuve de possession des données (Proof of Data Possession, PDP). Par exemple, avec un tarif de stockage de 2,50 USDFC par TiB et un forfait de génération de preuves de 0,12 USDFC par copie, le stockage d’un TiB en deux copies coûte environ 5,24 USDFC tous les 30 jours. L’estimation utilise la taille que vous saisissez. Filecoin calcule la taille exacte facturée à partir des nœuds feuilles contenant les données, ce qui peut ajouter jusqu’à 31 octets par pièce.

## Prévoir les frais d’envoi et la réserve remboursable

Ouvrez **Détails de l’envoi** pour définir le nombre de pièces et de lots d’envoi par copie. Le réglage par défaut est d’une pièce dans un lot. Chaque copie entraîne des frais de création de son jeu de données. L’ajout de pièces entraîne des frais de base par lot et des frais par pièce. La réserve pour le cycle de vie est un solde retenu par le service pour couvrir les opérations. La réserve affichée est distincte des dépenses estimées. Les fonds inutilisés sont libérés après le règlement. L’estimation couvre un nouvel envoi et sa durée de stockage. La récupération et les opérations ultérieures font l’objet de frais propres.

## D’où viennent les tarifs Filecoin ?

La page utilise les tarifs de référence datés qui figurent à côté du résultat. Sélectionnez **Actualiser les tarifs du réseau principal** pour consulter le contrat de tarification de Warm Storage via un RPC public Filecoin. Le navigateur utilise les tarifs renvoyés et affiche le bloc dont ils proviennent. Si cette requête échoue, vous pouvez toujours calculer avec les tarifs de référence.

Consultez le [guide des coûts de stockage Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) pour connaître les tailles exactes facturées, les fonds nécessaires selon le compte et le barème complet des frais.
