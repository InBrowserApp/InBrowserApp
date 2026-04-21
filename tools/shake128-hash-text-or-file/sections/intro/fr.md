## Qu’est-ce que SHAKE128 (FIPS 202) ?

SHAKE128 (FIPS 202) est une fonction à sortie extensible (XOF) de la famille SHA-3. Contrairement aux fonctions de hachage à longueur fixe, elle peut renvoyer n’importe quel nombre de bits tout en offrant une sécurité de 128 bits. Elle est normalisée par le NIST dans FIPS 202 et repose sur la construction en éponge Keccak.

Cette flexibilité est utile lorsqu’un protocole, un format de fichier ou une règle interne de somme de contrôle attend une longueur d’empreinte précise. Avec cet outil, vous pouvez hacher du texte brut ou des fichiers envoyés et choisir la longueur de sortie en bits, à condition qu’elle soit un multiple de 8.

Les usages courants incluent le hachage de protocoles, la dérivation de clés, les empreintes cryptographiques à longueur variable et les flux d’intégrité des données où la même entrée et la même longueur de sortie doivent toujours produire le même résultat.
