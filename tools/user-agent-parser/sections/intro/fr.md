## Qu'est-ce qu'un User-Agent ?

Une chaîne User-Agent (UA) identifie le navigateur ou l'application qui fait une requête et inclut généralement navigateur, OS, appareil et moteur. Comme elle peut être falsifiée, utilisez-la comme un indice plutôt qu'un signal de sécurité.

### Ce que cet analyseur affiche

Cet outil analyse localement dans votre navigateur la chaîne UA collée et regroupe le résultat par navigateur, système d’exploitation, moteur, appareil, CPU et sortie JSON. Rien n’est envoyé.

### Exemple

Collez une chaîne Chrome courante sur Windows comme celle-ci :

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Le résultat devrait identifier Chrome 115 sur Windows 10, avec le moteur Blink et l’architecture CPU amd64.

### Note importante

Les navigateurs modernes s’appuient de plus en plus sur les Client Hints. Une chaîne UA copiée peut donc ne pas révéler tout ce qu’un site voit lors d’une requête réelle.
