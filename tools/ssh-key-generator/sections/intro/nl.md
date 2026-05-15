## Wat is een SSH-sleutelpaar?

Een SSH-sleutelpaar is een openbare sleutel en een privésleutel die worden gebruikt om je te authenticeren bij servers, Git-hosts, deploymentsystemen en andere SSH-gebaseerde services. De openbare sleutel kun je delen. De privésleutel moet geheim blijven.

Deze generator maakt Ed25519- of RSA-sleutels in OpenSSH-indeling volledig in je browser. Hij toont ook de SHA-256-vingerafdruk, de compacte waarde die OpenSSH meestal weergeeft wanneer je een sleutel verifieert.

## Wanneer gebruik je deze tool

- Maak een ontwikkelsleutel voor een testserver, Git-remote, container of tijdelijke labomgeving.
- Genereer een Ed25519-sleutel wanneer je een moderne, compacte standaard nodig hebt voor nieuwe SSH-toegang.
- Genereer een RSA-sleutel wanneer een oudere service Ed25519 niet ondersteunt.
- Kopieer een openbare sleutel naar `authorized_keys` terwijl de privésleutel op je apparaat blijft.

## Hoe kies je een algoritme

Ed25519 is de beste standaardkeuze voor de meeste nieuwe SSH-sleutels, omdat het klein, snel en breed ondersteund is door actuele OpenSSH-versies. RSA is nuttig voor compatibiliteit met oudere apparaten, oude Git-servers of beleidsvereisten die nog steeds RSA-sleutels verwachten.

Voor RSA is 4096 bits een conservatieve standaardkeuze. Kleinere sleutels van 2048 bits zijn sneller en nog steeds gebruikelijk, maar veel teams geven nu de voorkeur aan 3072 of 4096 bits voor nieuwe sleutels die lang meegaan.

## Waar moet je op letten

- De privésleutel die hier wordt gemaakt, is onversleuteld. Voeg een wachtwoordzin toe met `ssh-keygen -p -f <key-file>` als je die nodig hebt.
- Bewaar de privésleutel met beperkende rechten, zoals `chmod 600 <key-file>`.
- Plak privésleutels niet in tickets, chat, logs of onbekende webpagina's.
- Roteer sleutels wanneer een laptop, CI-geheim of back-up met de privésleutel mogelijk is blootgesteld.
