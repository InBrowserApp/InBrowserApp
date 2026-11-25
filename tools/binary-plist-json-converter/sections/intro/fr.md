## Convertir un fichier Plist binaire en JSON

Choisis **Ouvrir un Plist binaire** ou dépose un fichier `.plist` binaire d’Apple. Vérifie le JSON mis en forme, puis copie-le ou télécharge-le au format `.json`. Les listes de propriétés binaires commencent par la signature `bplist00`. On les trouve dans les paquets d’applications Apple, les préférences et les données archivées. L’exemple montre comment les valeurs d’une liste de propriétés sont représentées en JSON.

## Convertir du JSON en liste de propriétés binaire Apple

Choisis **JSON vers Plist**, colle du JSON ou ouvre un fichier `.json`, puis choisis **Convertir en Plist binaire**. Télécharge le fichier `.plist` obtenu. Les chaînes de caractères, les booléens, les nombres, les tableaux et les objets deviennent les types équivalents de liste de propriétés. Remplace `null` par une valeur ou omets sa clé. Les fichiers et le texte collé sont traités dans ton navigateur.

## Conserver les dates, les octets et les grands entiers

JSON ne possède pas de type natif pour les dates, les données binaires ou les UID d’archives à clés. Ce convertisseur utilise les balises explicites `$plist` pour préserver le sens de ces valeurs dans les deux sens.

| Valeur Plist                             | Exemple JSON                                           |
| ---------------------------------------- | ------------------------------------------------------ |
| Date en UTC                              | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Octets en Base64                         | `{"$plist":"data","value":"AQID"}`                     |
| Grand entier sous forme de texte décimal | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID d’une archive à clés                 | `{"$plist":"uid","value":42}`                          |

Garde les balises lors de la conversion vers Plist. Pour un entier hors de la plage exacte de JSON, utilise la balise prévue pour les entiers et écris la valeur décimale entre guillemets. Si un dictionnaire a la même structure qu’une balise, le convertisseur l’encapsule dans une balise `dictionary` pour conserver ses clés. La conversion préserve la structure et les valeurs prises en charge. L’ordre des objets Plist, la taille de stockage des nombres et les octets d’origine peuvent changer.

[Structure et types des listes de propriétés Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
