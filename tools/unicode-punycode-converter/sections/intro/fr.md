## Convertir un domaine entre Unicode et Punycode

Collez un domaine comme `bücher.com` dans **Domaine Unicode** pour obtenir `xn--bcher-kva.com` dans **Domaine ASCII**. Collez un domaine `xn--` dans **Domaine ASCII** pour le lire en Unicode. Les deux champs se mettent à jour au fil de la saisie et vous pouvez copier l’une ou l’autre forme.

## Quand utiliser chaque forme

Punycode représente les caractères non ASCII des noms de domaine internationalisés (IDN) avec des lettres, des chiffres et des traits d’union ASCII. Chaque partie encodée commence par `xn--`. Les parties déjà en ASCII, comme `com`, restent inchangées. Utilisez la forme ASCII si les paramètres DNS ou d’hébergement la demandent, et la forme Unicode pour lire un domaine trouvé dans un journal ou un fichier de configuration.

## Que coller dans le convertisseur

Saisissez uniquement le nom d’hôte. Pour `https://bücher.com/catalog`, collez `bücher.com`. Le convertisseur prend aussi en charge les sous-domaines. Par exemple, `www.bücher.com` devient `www.xn--bcher-kva.com`.
