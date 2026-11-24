## Så läser du en DNS-zonfil

Öppna en DNS-export i BIND-format eller klistra in texten. Exemplet innehåller en SOA-post, IPv4- och IPv6-adressposter, e-postposter och en TXT-sträng. För varje rad visas postens namn, klass, typ, giltighetstid i sekunder (TTL) och postdata. Filtrera på namn, en typ som MX eller en del av ett värde. Kopiera sedan de synliga posterna som JSON för inventering eller migrering.

## Så hanteras ursprungsdomän, TTL och postdata

Med $ORIGIN satt till example.com. blir det relativa postnamnet ”www” det fullständiga namnet www.example.com. Namnet @ betecknar den aktuella ursprungsdomänen. En indragen post ärver namnet från föregående post. Om filen saknar $ORIGIN anger du domänen under Ursprungsdomän. Standardvärdet 1h för $TTL motsvarar 3 600 sekunder. En post med egen TTL använder det värdet. Citattecken, escape-sekvenser och relativa målnamn bevaras i postdata. Därför förblir ”hello; world” ett enda TXT-värde och ”mail” i en MX-post står kvar som ”mail”.

## Vad resultaten visar

Parsern läser kommentarer, text inom citattecken och flerradiga poster. Meddelanden anger vilken rad ett problem gäller. Poster som gick att läsa visas fortfarande. Om zonen använder $INCLUDE eller $GENERATE behöver du expandera direktiven innan du klistrar in de fullständiga posterna. Bearbetningen sker lokalt i webbläsaren. Verktyget kontaktar inga DNS-servrar och testar inte om en viss leverantör kan läsa in zonen.
