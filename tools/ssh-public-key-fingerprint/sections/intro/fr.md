## Qu’est-ce qu’une empreinte de clé publique SSH ?

Une empreinte de clé publique SSH est un condensé court du blob de clé publique. Elle vous donne une valeur compacte à comparer avant de faire confiance à une clé dans `authorized_keys`, dans un inventaire de serveurs ou dans un workflow de déploiement.

OpenSSH affiche couramment des empreintes SHA-256 comme `SHA256:...`. La documentation plus ancienne et certains audits utilisent encore des empreintes MD5 séparées par des deux-points. Cet outil affiche les deux afin que vous puissiez faire correspondre les sorties SSH modernes et les enregistrements hérités sans envoyer la clé où que ce soit.

Collez une seule clé publique, plusieurs lignes `authorized_keys` ou un bloc de clé publique SSH2. L’analyseur ignore les commentaires et les options authorized_keys, lit le vrai blob de clé SSH, puis calcule les empreintes localement dans votre navigateur.

- Vérifiez qu’une clé publique copiée correspond à l’empreinte partagée par un coéquipier.
- Comparez les entrées `authorized_keys` à une liste d’accès serveur.
- Inspectez le type de clé, la taille de clé, la courbe et le commentaire avant de copier une empreinte.
