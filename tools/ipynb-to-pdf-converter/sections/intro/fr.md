## Comment convertir un notebook Jupyter en PDF

Ouvrez ou déposez un fichier `.ipynb` enregistré depuis Jupyter, Google Colab ou VS Code. Vérifiez l’aperçu, choisissez A4 ou US Letter, puis sélectionnez **Enregistrer au format PDF**. Dans la boîte de dialogue d’impression du navigateur, choisissez **Enregistrer au format PDF** comme destination. Vous pouvez aussi y choisir une imprimante. Par exemple, `analysis.ipynb` devient un PDF à joindre à un e-mail ou à remettre avec un rapport.

## Contenu du PDF

Le PDF respecte l’ordre des cellules du notebook. Il comprend les titres et tableaux Markdown, le code source et les sorties enregistrées prises en charge, comme le texte de console, les tableaux et les images de graphiques intégrées. Les longues lignes de code sont renvoyées à la ligne pour tenir sur le papier. Les cellules longues peuvent continuer sur une autre page et le texte reste sélectionnable dans le navigateur.

Pour obtenir les résultats les plus récents, enregistrez le notebook avec ses sorties avant la conversion. Le convertisseur lit le fichier enregistré localement et n’exécute jamais les cellules. Les widgets doivent disposer d’une représentation statique enregistrée pour apparaître. Le code source LaTeX reste du texte et les images distantes ainsi que les autres ressources externes ne sont pas chargées.

## Autres façons d’utiliser le notebook

Utilisez la [visionneuse Jupyter Notebook](../notebook-viewer/) pour lire les cellules et les sorties enregistrées de manière interactive. Utilisez le [convertisseur Jupyter Notebook](../notebook-export/) pour obtenir du HTML, du Markdown ou un script de code.
