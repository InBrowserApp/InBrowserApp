## Exporter des événements de calendrier ICS en CSV

Choisissez **ICS vers CSV**, ouvrez un fichier iCalendar ou collez son contenu, puis cliquez sur **Convertir**. La feuille de calcul contient une ligne par événement enregistré avec son titre, son début, sa fin, son lieu, sa description et, le cas échéant, sa règle de récurrence. Téléchargez le CSV pour le consulter ou le modifier dans Excel ou Google Sheets. Un événement sur la journée entière utilise des dates sans heure, et la date de fin est exclue de l’intervalle. Par exemple, un événement qui occupe la journée du 12 mai se termine le 13 mai.

## Créer un fichier ICS à partir de lignes CSV

Choisissez **CSV vers ICS**, puis **Essayer un exemple** pour voir les en-têtes. Ajoutez au moins les colonnes `Title` et `Start`. Saisissez `2026-05-12` pour un événement sur la journée entière, `2026-05-12T09:00:00` pour une heure locale ou `2026-05-12T09:00:00Z` pour une heure en UTC. L’outil reconnaît aussi des en-têtes de Google Agenda comme `Subject`, `Start Date`, `Start Time` et `All Day Event`. Téléchargez le fichier ICS pour importer les événements dans votre calendrier.

## Conserver le calendrier d’origine pour une sauvegarde complète

Le CSV présente les informations sur les événements sous forme de lignes. Les séries récurrentes y figurent sous forme de règles, sans génération de dates individuelles. Les définitions de fuseau horaire intégrées au fichier sont conservées. Les pièces jointes, les rappels, les invités, les dates exclues des séries et les statuts d’annulation restent dans le calendrier d’origine. La conversion se déroule dans votre navigateur.
