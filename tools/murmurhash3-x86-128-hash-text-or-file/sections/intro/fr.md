## Qu'est-ce que MurmurHash3 (x86 128-bit) ?

MurmurHash3 est un algorithme de hachage non cryptographique rapide, conçu
pour produire des sommes de contrôle répétables et bien distribuées. La
variante x86 128-bit renvoie une valeur de 16 octets, généralement affichée
sous forme de 32 caractères hexadécimaux, ce qui la rend mieux adaptée que les
hachages 32 bits lorsque vous voulez un identifiant plus large pour de grands
ensembles d'enregistrements, de fichiers ou de clés de cache.

**Cas d'utilisation :**

- **Tables de hachage et partitionnement** : Créez des clés stables pour des
  compartiments, des partitions ou des tables de recherche.
- **Déduplication** : Comparez de grands ensembles de texte ou de fichiers à
  l'aide d'empreintes 128 bits compactes avant d'effectuer des contrôles plus
  approfondis.
- **Clés de cache** : Produisez des identifiants déterministes pour des
  artefacts de build, des données transformées ou du contenu généré.
- **Contrôles d'intégrité hors sécurité** : Détectez les changements accidentels
  pendant le stockage ou le transfert lorsque des garanties cryptographiques ne
  sont pas requises.

**Comportement de la graine :**

La graine facultative est une valeur non signée de 32 bits. Utilisez la même
graine lorsque vos résultats doivent correspondre à ceux d'un autre système, et
laissez-la à `0` lorsque vous n'avez pas d'exigence de compatibilité
particulière. Les valeurs décimales et les valeurs hexadécimales `0x` sont
acceptées ; les valeurs plus grandes sont ramenées à la même plage 32 bits que
celle utilisée par l'algorithme.

**Notes de sécurité :**

MurmurHash3 n'est pas un algorithme de hachage de mots de passe, de signature
ou de vérification inviolable. Utilisez SHA-256, HMAC ou un outil de hachage de
mots de passe lorsque la sortie doit offrir des propriétés de sécurité. Cet
outil convient surtout au hachage local, hors ligne et orienté performance,
lorsque la vitesse et une distribution stable comptent davantage que la
résistance aux attaques.
