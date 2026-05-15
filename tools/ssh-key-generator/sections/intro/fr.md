## Qu'est-ce qu'une paire de clés SSH ?

Une paire de clés SSH se compose d'une clé publique et d'une clé privée utilisées pour s'authentifier auprès de serveurs, d'hébergeurs Git, de systèmes de déploiement et d'autres services basés sur SSH. La clé publique peut être partagée. La clé privée doit rester secrète.

Ce générateur crée des clés Ed25519 ou RSA au format OpenSSH entièrement dans votre navigateur. Il affiche aussi l'empreinte SHA-256, la valeur compacte qu'OpenSSH affiche couramment lorsque vous vérifiez une clé.

## Quand utiliser cet outil

- Créer une clé de développement pour un serveur de test, un dépôt Git distant, un conteneur ou un environnement de laboratoire temporaire.
- Générer une clé Ed25519 lorsque vous avez besoin d'une valeur par défaut moderne et compacte pour un nouvel accès SSH.
- Générer une clé RSA lorsqu'un ancien service ne prend pas en charge Ed25519.
- Copier une clé publique dans `authorized_keys` tout en gardant la clé privée sur votre appareil.

## Comment choisir un algorithme

Ed25519 est la meilleure valeur par défaut pour la plupart des nouvelles clés SSH, car il est petit, rapide et largement pris en charge par les versions actuelles d'OpenSSH. RSA est utile pour la compatibilité avec les anciens équipements, les serveurs Git hérités ou les exigences de politique qui attendent encore des clés RSA.

Pour RSA, 4096 bits est une valeur par défaut prudente. Les clés plus petites de 2048 bits sont plus rapides et encore courantes, mais de nombreuses équipes préfèrent désormais 3072 ou 4096 bits pour les nouvelles clés à longue durée de vie.

## Points à garder à l'esprit

- La clé privée produite ici n'est pas chiffrée. Ajoutez une phrase secrète avec `ssh-keygen -p -f <key-file>` si vous en avez besoin.
- Stockez la clé privée avec des permissions restrictives, par exemple `chmod 600 <key-file>`.
- Ne collez pas de clés privées dans des tickets, des discussions, des journaux ou des pages web inconnues.
- Renouvelez les clés lorsqu'un ordinateur portable, un secret CI ou une sauvegarde contenant la clé privée pourrait être exposé.
