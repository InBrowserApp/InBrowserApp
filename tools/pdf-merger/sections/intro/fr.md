# Fusionner des fichiers PDF dans votre navigateur

Utilisez ce fusionneur de PDF lorsque vous avez besoin de créer un seul document à partir de plusieurs PDF sources, par exemple pour regrouper des pages numérisées, assembler des formulaires signés ou préparer des rapports à partager. Ajoutez au moins deux fichiers, vérifiez leur nombre de pages, puis organisez la file avant de créer le PDF final.

## Fonctionnement de l'ordre de fusion

L'outil ajoute toutes les pages du premier PDF, puis toutes les pages du PDF suivant, et continue ainsi jusqu'en bas de la file. Vous pouvez réordonner les fichiers avec les boutons flèches, faire glisser les lignes sur ordinateur, retirer les erreurs et afficher l'aperçu de chaque fichier source avant la fusion.

## Confidentialité et traitement des fichiers

Toute l'analyse et la fusion s'exécutent localement dans votre navigateur avec `pdf-lib` et un worker en arrière-plan. Vos fichiers ne sont pas envoyés à InBrowser.App, et le lien de téléchargement généré n'existe que dans la session actuelle du navigateur.

## Limites à connaître

Les PDF chiffrés ou endommagés ne peuvent pas toujours être fusionnés de façon fiable. Si un fichier est protégé par un mot de passe propriétaire, retirez d'abord cette restriction, puis ajoutez à nouveau le PDF déverrouillé. Les fichiers très volumineux peuvent prendre plus de temps, car le navigateur doit copier chaque page dans un nouveau document.
