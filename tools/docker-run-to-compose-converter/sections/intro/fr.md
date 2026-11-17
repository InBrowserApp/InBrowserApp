## Ce que fait cet outil

Le convertisseur Docker Run vers Compose transforme une ou plusieurs commandes
`docker run` en un fichier `docker-compose.yml` dans le navigateur. Vous pouvez
examiner le YAML généré, le copier ou le télécharger avant de l’intégrer à votre
projet.

## Quand l’utiliser

Utilisez-le pour transformer une commande de conteneur ponctuelle en une
définition de service Compose réutilisable, ou pour comprendre comment les ports,
les volumes, les variables d’environnement et les options de ressources se
traduisent dans Compose.

## À quoi s’attendre

Les options courantes, comme les ports, les variables d’environnement, la
politique de redémarrage, les contrôles d’état, les montages et les limites de
ressources, sont conservées. Les options non prises en charge ou ambiguës sont
signalées par des avertissements pour que vous puissiez examiner le résultat
avant de l’utiliser.
