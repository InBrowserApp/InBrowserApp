## Cosa fa questo strumento

L'Estrattore di palette da immagini trova i colori dominanti in un'immagine
direttamente nel browser. Campiona l'immagine, raggruppa i pixel visivamente
simili e restituisce una palette pratica con valori HEX, RGB, HSL e percentuali
per ciascun colore.

## Casi d'uso ideali

- Ricavare colori di marchio o prodotto da uno screenshot, un logo, una foto o
  un mockup.
- Creare rapidamente una palette CSS per una landing page, una miniatura o un
  passaggio al design.
- Confrontare quanto un'immagine dipenda da un colore dominante rispetto agli
  accenti di supporto.
- Lavorare con immagini private senza inviare il file a un server.

## Opzioni di esportazione

Il risultato può essere copiato come semplice elenco HEX, proprietà
personalizzate CSS o JSON. Il formato CSS è utile quando vuoi variabili come
`--palette-1`, mentre JSON mantiene insieme i formati colore e il rapporto di
dominanza per script o automazioni di design.

## Aspetti da considerare

- L'estrazione della palette è approssimativa. È pensata per produrre gruppi
  visivi utili, non un inventario completo di ogni colore dei pixel.
- I pixel trasparenti vengono ignorati per impostazione predefinita, così icone
  e ritagli non alterano la palette; disattiva l'opzione quando la trasparenza
  stessa fa parte dell'immagine.
- L'impostazione di qualità precisa campiona più pixel e può essere più lenta su
  immagini molto grandi.
