## Exporter un notebook Jupyter enregistré

Ouvrez un notebook IPYNB et choisissez le HTML, le Markdown ou le code. Le HTML et le Markdown conservent les cellules dans leur ordre enregistré, y compris les sorties enregistrées prises en charge. Tout reste dans votre navigateur. Aucun noyau, code ou environnement d’exécution de widgets n’est lancé.

## Choisir un format adapté

Le HTML fournit une copie de lecture autonome avec du texte sélectionnable, les images incluses prises en charge et des tableaux lisibles. Le Markdown fournit un contenu réutilisable ; les tableaux peuvent contenir du HTML sécurisé et les images utilisent des URL de données intégrées que certaines applications Markdown n’affichent pas. La mise en page et la mise en forme d’origine peuvent changer.

L’export de code conserve les cellules de code dans leur ordre et omet le Markdown, les cellules de texte brut et les sorties enregistrées. Si le langage du notebook est reconnu, il détermine l’extension du script ; sinon, le fichier utilise le format TXT. Les commandes magiques du notebook et la syntaxe du shell restent telles quelles : le code exporté peut donc nécessiter des ajustements manuels ou le noyau d’origine du notebook. Un notebook sans cellule de code produit un fichier de code vide.

## Résultats enregistrés et compatibilité

Le convertisseur lit le format de notebook 4. Les résultats proviennent du fichier enregistré et peuvent être obsolètes. Le contenu enrichi non pris en charge et les images indisponibles sont signalés. Les ressources distantes ne sont pas récupérées ; les scripts, widgets, fichiers audio et vidéos ne sont ni exécutés ni lus. LaTeX reste sous forme de texte source, et les cellules de texte brut ou de type inconnu apparaissent comme du texte lisible dans les exports de documents.

Les ressources du navigateur déterminent les limites pratiques ; aucune limite fixe n’est imposée à la taille du fichier ni au nombre de cellules. Pour consulter le notebook d’origine, utilisez la [Visionneuse de notebooks Jupyter](/tools/notebook-viewer/).
