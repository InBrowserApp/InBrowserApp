## Générer des paires de latitude et de longitude aléatoires

Choisissez **Monde entier** pour obtenir des coordonnées sur l’ensemble du globe, ou **Autour d’un point** pour en générer autour d’un centre. Indiquez la quantité et sélectionnez **Générer**. Copiez le lot ou téléchargez un fichier texte `UTF-8` contenant une paire par ligne. Utilisez ces coordonnées pour placer des repères sur une carte, tester des champs de localisation ou préparer des données de test géospatiales.

## Générer des coordonnées autour d’un point

Saisissez la latitude et la longitude du centre, puis le rayon en kilomètres. Par exemple, saisissez `37.774900` et `-122.419400` pour un centre à San Francisco, avec un rayon de `25` km pour obtenir des points à proximité. La latitude va de `-90` à `90` et la longitude de `-180` à `180`. Une latitude négative indique une position au sud de l’équateur et une longitude négative une position à l’ouest du méridien d’origine.

## Lire les coordonnées décimales

Chaque ligne indique d’abord la latitude, puis la longitude, séparées par une virgule. Une paire se présente ainsi : `37.774900, -122.419400`. Le résultat conserve six décimales et un point décimal dans toutes les langues du site. Respectez cet ordre lorsque vous collez les coordonnées dans un autre outil et vérifiez les noms des champs si celui-ci attend la longitude en premier.
