## Ce Que Fait L’outil

Cet outil analyse les en-têtes Cookie et Set-Cookie bruts en JSON structuré directement dans votre navigateur. Vous pouvez coller une seule ligne d’en-tête, plusieurs lignes, ou seulement des valeurs sans les préfixes habituels.

## Cookie Vs. Set-Cookie

Un en-tête Cookie contient généralement plusieurs paires nom/valeur envoyées par le client. Un en-tête Set-Cookie définit généralement un seul cookie avec des attributs comme Path, Secure, HttpOnly, SameSite, Expires ou Max-Age.

## Notes

L’analyseur fonctionne localement et n’envoie aucun en-tête à un serveur. Les segments invalides restent dans une liste séparée afin de repérer rapidement les chaînes de cookies mal formées.
