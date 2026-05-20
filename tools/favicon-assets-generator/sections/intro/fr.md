## Ce que génère l'outil

Ce générateur transforme une seule image en un ensemble de favicons complet
et moderne — un `.ico` multi-tailles pour les navigateurs historiques, les
variantes PNG en 16 / 32 / 180 / 192 / 512, un `.svg` original facultatif,
un `site.webmanifest` pour les PWA, ainsi que l'extrait HTML à coller dans
`<head>`. Chaque octet est produit dans votre navigateur ; aucun envoi,
aucun serveur, aucune analyse.

## Ce que contient l'archive

- `favicon.ico` — multi-images (16 / 32 / 48) pour les onglets de
  navigateur, les favoris et les anciens raccourcis Windows.
- `favicon-16x16.png` et `favicon-32x32.png` — variantes PNG modernes
  utilisées par les navigateurs actuels.
- `favicon.svg` — inclus uniquement si votre image source est SVG et que
  l'option « Utiliser le SVG original » est activée.
- `apple-touch-icon.png` — 180×180, opaque, utilisée par les écrans
  d'accueil iOS.
- `pwa-192x192.png` et `pwa-512x512.png` — les icônes PWA standard.
- `pwa-maskable-192x192.png` et `pwa-maskable-512x512.png` — variantes
  masquables avec la zone de sécurité recommandée par le W3C.
- `site.webmanifest` — le manifeste PWA relié aux icônes ci-dessus.

## Fonctionnement des marges, de l'arrière-plan et des zones de sécurité masquables

Chaque plateforme dispose de sa propre marge (« Marge ») pour laisser de
l'espace de respiration à l'intérieur du canevas de l'icône. Le commutateur
« Ajouter un arrière-plan » peint un carré opaque derrière votre source —
utile lorsque la source est transparente et que la destination exige
l'opacité (l'écran d'accueil d'Apple) ou simplement pour le contraste
visuel dans un onglet de navigateur. Les icônes PWA masquables utilisent
une zone de sécurité supplémentaire par-dessus la marge de la plateforme :
tout ce qui se trouve en dehors des ~80 % centraux peut être rogné par
Android, Windows ou ChromeOS lors de l'application d'un masque circulaire,
arrondi ou en squircle.

## Intégration de l'archive dans votre site

1. Décompressez l'archive téléchargée dans la racine de votre site web (de
   sorte que les fichiers se trouvent à `/favicon.ico`, `/site.webmanifest`,
   etc.).
2. Collez l'extrait HTML dans le `<head>` de votre site.
3. Si vous servez les ressources depuis un sous-chemin (par exemple
   `/static/icons/`), définissez le « Chemin des ressources » avant de
   générer afin que l'extrait et le manifeste utilisent les bonnes URL.
4. Si vous avez personnalisé le manifeste au-delà de ce que cet outil
   expose (par exemple pour ajouter `categories` ou `screenshots`), ouvrez
   `site.webmanifest` dans un éditeur de texte et modifiez-le
   directement — il s'agit de JSON brut.
