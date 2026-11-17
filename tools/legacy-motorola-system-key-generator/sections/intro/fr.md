## Qu’est-ce qu’une clé système Motorola d’ancienne génération ?

Une clé système logicielle est un fichier `.KEY` utilisé par les logiciels de programmation Motorola compatibles pour permettre la modification des paramètres protégés d’un système radio à ressources partagées. Ce générateur reproduit le format d’ancienne génération dérivé de BatLabs pour un identifiant système. Une clé système est différente d’une clé de chiffrement des communications radio et n’accorde pas à elle seule l’accès à un réseau radio.

## Comment utiliser ce générateur

1. Saisissez un identifiant système composé de 1–4 chiffres hexadécimaux (`0–9`, `A–F`), sans préfixe `0x`. Les lettres minuscules sont acceptées et les identifiants courts sont complétés par des zéros à gauche : `ab` devient `00AB`.
2. Vérifiez l’identifiant normalisé, le nom du fichier et l’aperçu hexadécimal.
3. Téléchargez le fichier binaire `.KEY` et chargez-le dans un logiciel de programmation d’ancienne génération compatible. Le fichier fait 27 octets ; l’identifiant système `1234` produit le fichier `SYS01234.KEY`.

## Limites de compatibilité

Cet outil suit un format d’ancienne génération publié ; la compatibilité dépend du logiciel de programmation. Il ne prend pas en charge ASTRO 25 Portable CPS (y compris XTS5000), APX CPS ni les Advanced System Keys (ASK). La conformité au format binaire de référence ne confirme pas la compatibilité avec un poste radio ou une version de CPS en particulier.

## Confidentialité

La génération, la validation et les aperçus de fichiers s’exécutent localement dans votre navigateur. Votre identifiant système et la clé générée ne sont pas envoyés à un serveur.
