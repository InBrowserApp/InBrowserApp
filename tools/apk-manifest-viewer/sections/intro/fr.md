## Ouvrir un APK et lire son manifeste

Dépose un fichier `.apk` Android ou choisis **Ouvrir un APK ou un manifeste**. La visionneuse ouvre le fichier `AndroidManifest.xml` inclus dans l’APK, y compris lorsqu’il utilise le format XML binaire compilé courant. Tu peux aussi ouvrir un manifeste déjà extrait, au format binaire ou texte. Essaie l’APK d’exemple pour explorer la vue d’ensemble et le XML décodé. Tes fichiers restent dans ton navigateur.

## Comprendre les champs du package, de la version et du SDK

Le **Nom du package** identifie l’application Android. Le nom de version est le libellé affiché aux utilisateurs. Le code de version est le numéro qu’Android utilise pour établir l’ordre des mises à jour. Le SDK minimal indique le niveau d’API Android le plus ancien déclaré dans le manifeste et le SDK cible indique le niveau visé par l’application. Les champs absents du manifeste sont indiqués comme non spécifiés.

## Examiner les autorisations et exporter AndroidManifest.xml

La vue d’ensemble indique les noms des autorisations déclarées par le package. Sur l’appareil, Android décide quelles autorisations sont accordées en fonction de la version du système, des paramètres de l’application et des choix de l’utilisateur. Ouvre **XML du manifeste** pour consulter les composants, les filtres d’intent et les déclarations conditionnelles d’autorisations. Utilise **Copier le XML** ou **Télécharger le XML** pour conserver le fichier décodé. Les références à des ressources compilées peuvent apparaître sous forme d’identifiants, par exemple `@0x7f010001`.

[Structure et éléments du manifeste Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
