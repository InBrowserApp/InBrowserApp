Le déchiffrement AES restaure le texte en clair à partir de données chiffrées avec le même matériau de clé AES. Cet outil est conçu pour l’enveloppe JSON produite par le Chiffreur AES d’InBrowser.App. L’enveloppe conserve ensemble l’algorithme, les paramètres de dérivation de clé, le sel, l’IV, le texte chiffré et les métadonnées du texte en clair, tandis que le mot de passe ou la clé brute reste à part.

Tout le traitement s’effectue localement avec la Web Crypto API du navigateur. Le JSON chiffré, le mot de passe, la clé brute et le résultat déchiffré ne sont pas téléversés.

## Quand utiliser cet outil

Utilisez-le lorsqu’on vous remet une enveloppe JSON `inbrowser-aes-v1` ou lorsque vous devez récupérer une note, un jeton, un extrait de configuration ou un fichier que vous avez chiffré auparavant avec la page Chiffreur AES correspondante.

Si l’enveloppe a été créée avec un mot de passe, saisissez le même mot de passe : l’outil réutilisera le hachage PBKDF2, le nombre d’itérations, le sel, le mode AES et la longueur de clé stockés. Si l’enveloppe a été créée avec une clé brute, collez exactement la clé hexadécimale de la longueur indiquée dans l’enveloppe.

## Notes pratiques

AES-GCM authentifie les données chiffrées ; ainsi, les mauvaises clés ou le JSON modifié devraient échouer au lieu de renvoyer un texte en clair altéré. AES-CBC et AES-CTR peuvent déchiffrer des enveloppes compatibles, mais ils n’authentifient pas le texte chiffré par eux-mêmes.

Conservez le mot de passe ou la clé brute séparément de l’enveloppe JSON. Toute personne disposant à la fois de l’enveloppe et du matériau de clé peut récupérer le texte en clair. Pour les enveloppes de fichier, le téléchargement du fichier récupéré utilise le nom de fichier d’origine et le type de média stockés dans le JSON.
