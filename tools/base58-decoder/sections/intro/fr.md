## A quoi sert cet outil

Utilisez cet outil pour decoder des chaines Base58 ou des fichiers texte et
retrouver leurs octets d'origine directement dans le navigateur. Il est utile
pour inspecter des donnees copiees depuis des API, des portefeuilles, des logs,
des flux QR ou des etapes d'import et d'export sans envoyer le contenu vers un
serveur.

## Quand changer d'alphabet

Base58 n'utilise pas un alphabet unique. Bitcoin, Flickr et Ripple emploient des
ordres de caracteres differents. Si une valeur echoue a la validation ou se
decode avec un mauvais resultat, changez d'alphabet et reessayez avec celui du
systeme qui a produit la valeur.

## Points a surveiller

Le panneau de sortie affiche un apercu UTF-8 lorsque les octets decodes peuvent
etre lus comme du texte. Pour des donnees binaires ou non textuelles, il vaut
mieux telecharger le fichier .bin afin de conserver les octets exacts. Les
espaces et retours a la ligne colles sont ignores, donc les valeurs coupees dans
un e-mail, un document ou un terminal peuvent quand meme etre decodees.
