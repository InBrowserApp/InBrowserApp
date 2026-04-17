## Qu'est-ce que chmod ?

`chmod` ("change mode") est une commande Unix/Linux qui permet de modifier les permissions des fichiers et dossiers. Ce calculateur vous laisse passer entre des permissions numériques comme `755`, des permissions symboliques comme `rwxr-xr-x` et la matrice de cases à cocher sans faire le calcul mental.

## Comment fonctionnent les permissions numériques

Chaque chiffre représente un rôle : propriétaire, groupe et autres. Dans chaque chiffre, `4` signifie lecture, `2` écriture et `1` exécution. Additionnez-les pour obtenir la permission voulue : `7 = rwx`, `6 = rw-`, `5 = r-x` et `4 = r--`. Pour un dossier, le bit d'exécution permet aussi d'y entrer.

## Exemples courants de chmod

- `chmod 755 script.sh` donne tous les droits au propriétaire et permet aux autres de lire et d'exécuter.
- `chmod 644 notes.txt` laisse le propriétaire modifier le fichier pendant que les autres peuvent seulement le lire.
- `chmod 600 .env` est un choix courant pour des secrets privés, car seul le propriétaire peut lire ou écrire.
- `chmod 775 shared-folder` est utile pour des dossiers d'équipe quand le groupe doit aussi pouvoir créer et modifier des fichiers.
