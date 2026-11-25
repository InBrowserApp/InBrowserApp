## Convertir une adresse Filecoin f410 en adresse 0x

Collez une adresse `f410` ou `t410` et sélectionnez **Convertir l’adresse**. Le convertisseur vérifie la somme de contrôle Filecoin et affiche l’adresse `0x` correspondante au format Ethereum, avec une somme de contrôle EIP-55. Copiez le résultat pour l’utiliser dans un portefeuille ou un explorateur de blocs qui emploie des adresses au format Ethereum sur Filecoin. Avec **Essayer un exemple**, vous pouvez voir une conversion sans saisir votre propre adresse.

## Convertir une adresse 0x au format Filecoin

Collez une adresse `0x` contenant 40 chiffres hexadécimaux. Sélectionnez **Réseau principal** pour obtenir une adresse `f410` ou **Réseau de test Calibration** pour une adresse `t410`. Le format `0x` ne contient aucun préfixe de réseau, de sorte que les mêmes octets peuvent s’écrire avec l’un ou l’autre préfixe Filecoin. Sélectionnez le réseau utilisé par votre portefeuille, votre explorateur ou votre plateforme d’échange. Les valeurs hexadécimales entièrement en minuscules ou en majuscules sont acceptées. Les valeurs qui mélangent les deux casses doivent passer la vérification EIP-55.

## Que signifient f410 et t410 ?

Ce sont des adresses déléguées utilisées par la machine virtuelle Ethereum de Filecoin (FEVM). Une adresse `f410` ou `t410` et son équivalent `0x` représentent la même adresse de 20 octets sur le réseau Filecoin sélectionné. Le format natif Filecoin utilise Base32 et sa propre somme de contrôle. La conversion conserve les octets d’origine et les FIL restent sur leur réseau.

## Puis-je convertir des adresses f0, f1, f2 ou f3 ?

Cet outil convertit les adresses déléguées FEVM de l’espace de noms `10`, identifiées par le préfixe `f410` ou `t410`. Les adresses d’ID d’acteur, leurs représentations masquées `0xff0000…` et les autres types d’adresses Filecoin sortent de ce périmètre. L’association de certains types d’adresses natives à un acteur nécessite l’état de la chaîne. La conversion s’effectue dans votre navigateur, sans appel RPC ni connexion à un portefeuille.

Consultez le [guide Filecoin sur les types d’adresses et les transferts](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) et la [spécification EIP-55 sur les sommes de contrôle](https://eips.ethereum.org/EIPS/eip-55).
