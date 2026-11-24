## Convertir des contacts VCF en feuille de calcul CSV

Choisissez **vCard vers CSV**, ouvrez un fichier `.vcf` ou collez son contenu, puis cliquez sur **Convertir**. Le CSV contient une ligne par contact. Téléchargez-le pour trier ou modifier votre carnet d’adresses dans Excel, Google Sheets ou un autre tableur. Cliquez sur **Essayer un exemple** pour voir le format attendu dans chaque sens.

## Transformer une liste de contacts CSV en vCards

Choisissez **CSV vers vCard** et ajoutez un CSV encodé en UTF-8 avec les noms des colonnes sur la première ligne. L’outil reconnaît `Full Name`, `First Name`, `Last Name`, `Email`, `Phone`, `Company`, `Job Title`, `Website`, `Address` et `Notes`, ainsi que des variantes courantes utilisées par les carnets d’adresses. Par exemple, une ligne sous `First Name,Last Name,Email` peut produire un contact avec un nom d’affichage et deux champs distincts pour le prénom et le nom de famille.

Téléchargez le VCF obtenu pour importer les contacts dans votre carnet d’adresses. Le fichier contient une vCard 3.0 par ligne de contact.

## Quelles données le CSV conserve-t-il ?

Le CSV est un tableau. L’outil conserve la première adresse e-mail, le premier numéro de téléphone, le premier site web et la première adresse de chaque fiche. Les photos, les libellés de champs et les propriétés vCard personnalisées restent dans le fichier VCF d’origine. Conservez-le si vous avez besoin d’une sauvegarde complète. La conversion se déroule dans votre navigateur.
