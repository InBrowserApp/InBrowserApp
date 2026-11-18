## Comment tester votre clavier

Sélectionnez **Lancer le test**, puis appuyez sur les touches de votre clavier physique et relâchez-les une à une. Chaque touche s’allume tant que vous la maintenez enfoncée et reste marquée d’un point après l’avoir relâchée. Testez les touches Ctrl, Shift et Alt des deux côtés, puis vérifiez le pavé numérique séparément si votre clavier en possède un. Sélectionnez **Réinitialiser** pour effacer les marques et refaire le test.

## Tester les combinaisons, le rollover et les touches fantômes

Essayez une combinaison que vous utilisez dans un jeu ou une application. Par exemple, maintenez `W`, `A`, `Shift` et `Space` enfoncées en même temps. Les quatre touches devraient s’afficher sous **Combinaison actuelle**. La valeur **Max. simultanées** indique le plus grand nombre de touches détectées au même instant par le navigateur depuis le début du test, y compris les modificateurs.

Le rollover désigne la capacité du clavier à enregistrer plusieurs touches à la fois. Si une touche fonctionne seule mais n’est plus détectée dans une combinaison précise, le clavier bloque peut-être cette frappe. Si une touche que vous n’avez jamais enfoncée apparaît, il peut s’agir d’une touche fantôme (ghosting). Testez la combinaison qui pose problème, car le comportement peut varier d’un groupe de touches à l’autre. [Démonstration de Microsoft sur les touches fantômes](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Pourquoi une touche n’est-elle pas détectée ?

Sélectionnez à nouveau **Lancer le test** si vous avez cliqué ailleurs ou si vous avez quitté la zone de test avec Tab ou Esc. Le clavier ou le système d’exploitation gère certaines touches, dont Fn et certaines touches multimédias. Le navigateur peut aussi intercepter un raccourci avant qu’il n’atteigne cette page. Si une touche de lettre ne répond jamais lorsque vous l’enfoncez seule, essayez-la dans une autre application pour voir si le problème s’y produit également.

## Pourquoi une autre touche s’allume-t-elle ?

Le schéma reprend les positions physiques d’un clavier ANSI avec pavé numérique. Avec la disposition française AZERTY, appuyer sur `A` peut allumer `Q` sur le schéma. Sous **Dernière touche**, la valeur produite par votre disposition, `a`, s’affiche à côté du code physique `KeyQ`. Si votre clavier est compact, testez les touches dont il dispose. [Guide MDN sur les codes des touches physiques](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
