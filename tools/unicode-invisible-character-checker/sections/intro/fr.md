## Pourquoi les caractères invisibles posent problème

Les caractères Unicode invisibles passent facilement inaperçus, car ils ne
semblent pas anormaux dans un éditeur classique. Le problème apparaît plus tard :
les modifications de texte échouent, les identifiants ne correspondent plus, les
retours à la ligne deviennent étranges ou le texte se comporte différemment dans
les contextes d’écriture de droite à gauche.

## Ce que cet outil détecte

Ce vérificateur recherche quatre groupes courants : les marques de largeur nulle,
les commandes bidirectionnelles, les espaces spéciaux et les commandes de
formatage. Il indique précisément leur emplacement, fournit un aperçu annoté et
prépare une version nettoyée que vous pouvez copier ou exporter.

## Quand l’utiliser

Utilisez-le après avoir copié du texte depuis des documents, des PDF, des feuilles
de calcul, des applications de discussion, des éditeurs de CMS ou des outils de
conception. Il est particulièrement utile lorsqu’une chaîne semble normale,
mais que les comparaisons, le rendu ou les traitements ultérieurs continuent de
se comporter de manière étrange.
