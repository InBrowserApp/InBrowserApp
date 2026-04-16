## Qu'est-ce qu'un code de statut HTTP ?

Un code de statut HTTP est un code de reponse a trois chiffres renvoye par un serveur pour indiquer ce qui s'est passe pendant une requete. On le retrouve souvent dans les outils de developpement du navigateur, les reponses API, les journaux serveur, les sondes de supervision et les tableaux de bord de proxy inverse.

### Comment lire les principales familles de codes

- **1xx Informationnel :** Le serveur a bien recu la requete et le traitement continue.
- **2xx Succes :** La requete s'est terminee correctement.
- **3xx Redirection :** Le client doit suivre un autre emplacement ou reutiliser un resultat mis en cache.
- **4xx Erreur client :** La requete elle-meme pose probleme, par exemple ressource absente, entree invalide ou authentification echouee.
- **5xx Erreur serveur :** Le serveur ou une dependance amont a echoue pendant le traitement d'une requete valide.

### Quand ce lookup est utile

Utilisez cet outil lorsque vous voulez confirmer la signification d'un code, comparer des codes proches comme 401 et 403 ou 502 et 504, ou rechercher a partir d'une expression vue dans un message d'erreur. La recherche fonctionne par code, nom du statut et description localisee.

### Pourquoi une interpretation correcte compte

Lors d'un diagnostic, le code de statut est souvent l'indice le plus rapide. Une reponse 4xx pointe generalement vers la requete, les identifiants ou la ressource cible. Une reponse 5xx pointe plutot vers l'application, la passerelle ou un service amont. Lire la categorie en premier aide a choisir la bonne suite.
