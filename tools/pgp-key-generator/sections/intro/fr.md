# Générateur de clés PGP

Utilisez cet outil pour créer une paire de clés OpenPGP directement dans votre navigateur. Il produit une clé publique blindée, une clé privée, un certificat de révocation, un ID de clé et une empreinte, afin que vous puissiez configurer des workflows de messagerie chiffrée, de chiffrement de fichiers, de signature de versions ou de récupération de compte sans envoyer le matériel de clé à un serveur.

## Quand l'utiliser

Les clés PGP sont utiles lorsque vous avez besoin de cryptographie asymétrique : d'autres personnes utilisent votre clé publique pour chiffrer des données à votre intention ou vérifier des signatures, tandis que votre clé privée déchiffre les données et crée des signatures. Un générateur basé sur le navigateur est pratique pour les courtes sessions de configuration, les démonstrations ou les workflows locaux où vous voulez obtenir le résultat immédiatement.

## Comment générer une paire de clés

Saisissez un nom, un e-mail, ou les deux, afin que la clé dispose d'un ID utilisateur reconnaissable. Ajoutez un commentaire optionnel si vous voulez distinguer des clés de travail, de projet ou de signature de versions. Choisissez ECC pour les logiciels OpenPGP modernes, ou RSA lorsque vous avez besoin de compatibilité avec des outils plus anciens. Une phrase de passe est optionnelle, mais fortement recommandée pour toute clé privée que vous comptez conserver.

## Types de clés et expiration

ECC utilise Curve25519 et constitue le choix par défaut, car il est compact et rapide. RSA est disponible en 2048, 3072 et 4096 bits pour la compatibilité. L'expiration est définie en jours ; utilisez 0 uniquement pour les clés que vous gérez activement et que vous pouvez révoquer. Des périodes d'expiration plus courtes réduisent le risque à long terme et facilitent les habitudes de rotation.

## Manipuler les clés privées en toute sécurité

Téléchargez la clé publique, la clé privée et le certificat de révocation sous forme de fichiers séparés. Sauvegardez la clé privée dans un gestionnaire de mots de passe chiffré ou un stockage hors ligne sécurisé, et conservez le certificat de révocation dans un emplacement séparé afin de pouvoir retirer la clé si la clé privée est perdue ou exposée. Avant de publier une clé publique, comparez l'empreinte via un canal de confiance.
