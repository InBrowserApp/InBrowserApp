## Comment convertir une police TTF ou OTF en WOFF2

Choisissez un ou plusieurs fichiers de police TrueType (`.ttf`) ou OpenType (`.otf`), ou déposez-les dans le convertisseur. La conversion démarre dès que vous ajoutez les fichiers. Lorsqu’une police est prête, comparez la taille du fichier d’origine à celle du WOFF2, puis sélectionnez **Télécharger le WOFF2**. Par exemple, `Inter-Regular.ttf` devient `Inter-Regular.woff2`. La conversion se déroule entièrement dans votre navigateur. Les fichiers restent sur votre appareil.

## Pourquoi utiliser le format WOFF2 pour les polices web ?

Le format WOFF2 (Web Open Font Format 2) compresse les données de la police avec Brotli. Une police WOFF2 demande généralement moins de données à transférer que le fichier TTF ou OTF d’origine. Le gain dépend de la police. La conversion conserve tous les glyphes ainsi que les axes de variation des polices variables. Un seul fichier peut donc toujours couvrir plusieurs graisses. Si votre site n’utilise qu’un jeu de caractères précis, un [générateur de sous-ensembles de polices](../font-subset-generator/) peut réduire davantage la taille du fichier.

## Comment utiliser un fichier WOFF2 en CSS

Placez le fichier téléchargé dans le dossier des polices de votre site, puis référencez-le avec `@font-face`. Adaptez le chemin, la graisse et le style au fichier utilisé. Cet exemple charge une police de graisse normale à partir de `/fonts/` et affiche le texte avec une police de secours pendant le chargement.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Pour une police variable, indiquez la plage de graisses qu’elle prend en charge, par exemple `font-weight: 100 900;`. Avant de l’héberger sur un site web, vérifiez sa licence et testez les langues et les graisses utilisées sur vos pages. Consultez la [documentation MDN de @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
