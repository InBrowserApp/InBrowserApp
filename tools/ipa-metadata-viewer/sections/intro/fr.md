## Ouvrir un IPA et lire les métadonnées de l’app principale

Dépose un fichier `.ipa` iOS ou choisis **Ouvrir un fichier IPA**. La visionneuse lit la liste de propriétés de l’app principale à un emplacement tel que `Payload/Trail Notes.app/Info.plist`. Essaie l’IPA d’exemple pour découvrir les champs avant d’ouvrir ton propre fichier. L’extraction de l’archive et la lecture de la liste de propriétés se font dans ton navigateur.

## Comprendre l’identifiant de paquet, les versions et les plateformes

L’identifiant de paquet, enregistré dans `CFBundleIdentifier`, identifie le paquet de l’app. La valeur de `CFBundleShortVersionString` indique la version publiée et `CFBundleVersion` identifie le build. Consulte `MinimumOSVersion` et `CFBundleSupportedPlatforms` pour vérifier la version minimale du système et les noms de plateformes enregistrés dans le paquet. Le nom affiché provient de `CFBundleDisplayName` ou de `CFBundleName`.

## Examiner et exporter Info.plist

Sélectionne **Info.plist** pour afficher la liste de propriétés complète en XML lisible, y compris les clés absentes de la vue d’ensemble. La visionneuse lit les listes de propriétés binaires et XML. Choisis **Copier le XML** pour réutiliser le contenu lisible dans un autre outil ou **Télécharger Info.plist** pour enregistrer le fichier d’origine sans modification. Le chemin affiché dans l’archive indique de quel paquet d’app proviennent les métadonnées.

[Documentation Apple sur les listes de propriétés d’information](https://developer.apple.com/documentation/bundleresources/information-property-list)
