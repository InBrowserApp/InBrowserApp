## Qu'est-ce qu'une adresse IPv6 de lien local ?

Les adresses IPv6 de lien local sont des adresses IPv6 spéciales qui sont automatiquement configurées sur chaque interface activée pour IPv6. Elles commencent toujours par le préfixe fe80::/10 et sont utilisées pour la communication entre les appareils sur le même segment de réseau. Ces adresses ne sont pas routables au-delà du lien local et sont couramment utilisées pour la découverte de voisins, la découverte de routeurs et d'autres protocoles de réseau local. Les adresses de lien local peuvent être générées à partir de l'adresse MAC d'un appareil en utilisant le format EUI-64.

### Quand l'utiliser

Utilisez-le lorsque vous avez besoin de l'adresse de lien local déterministe qu'EUI-64 dérive de l'adresse MAC d'un appareil.

### Comment fonctionne le mappage EUI-64

1. Normalisez l'adresse MAC sur 48 bits.
2. Inversez le `U/L bit` dans le premier octet.
3. Insérez `ff:fe` au milieu pour créer un identifiant d'interface de 64 bits.
4. Préfixez l'identifiant avec `fe80::/10`.

### Formats d'entrée pris en charge

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### Suffixe d'interface facultatif

Ajoutez `%eth0`, `%en0` ou un autre identifiant de zone uniquement lorsqu'une commande locale doit savoir quelle interface utiliser.
