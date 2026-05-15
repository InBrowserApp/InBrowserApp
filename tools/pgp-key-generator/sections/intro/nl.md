# PGP-sleutelgenerator

Gebruik deze tool om rechtstreeks in je browser een OpenPGP-sleutelpaar te maken. De tool produceert een armored openbare sleutel, privésleutel, intrekkingscertificaat, sleutel-ID en vingerafdruk, zodat je workflows voor versleutelde e-mail, bestandsversleuteling, release-ondertekening of accountherstel kunt instellen zonder het sleutelmateriaal naar een server te sturen.

## Wanneer je dit gebruikt

PGP-sleutels zijn nuttig wanneer je asymmetrische cryptografie nodig hebt: andere mensen gebruiken je openbare sleutel om gegevens voor jou te versleutelen of handtekeningen te verifiëren, terwijl je privésleutel gegevens ontsleutelt en handtekeningen maakt. Een browsergebaseerde generator is handig voor korte instelsessies, demo's of lokale workflows waarbij je het resultaat meteen wilt hebben.

## Een sleutelpaar genereren

Voer een naam, e-mail of beide in, zodat de sleutel een herkenbare gebruikers-ID heeft. Voeg optioneel een opmerking toe als je sleutels voor werk, projecten of release-ondertekening wilt scheiden. Kies ECC voor moderne OpenPGP-software, of RSA wanneer je compatibiliteit met oudere tools nodig hebt. Een wachtwoordzin is optioneel, maar sterk aanbevolen voor elke privésleutel die je wilt bewaren.

## Sleuteltypen en verval

ECC gebruikt Curve25519 en is de standaard omdat het compact en snel is. RSA is beschikbaar met 2048, 3072 en 4096 bits voor compatibiliteit. Verval wordt ingesteld in dagen; gebruik 0 alleen voor sleutels die je actief beheert en kunt intrekken. Kortere vervalperiodes verminderen risico op lange termijn en maken rotatiegewoonten eenvoudiger.

## Privésleutels veilig behandelen

Download de openbare sleutel, privésleutel en het intrekkingscertificaat als afzonderlijke bestanden. Maak een back-up van de privésleutel in een versleutelde wachtwoordmanager of veilige offline opslag, en bewaar het intrekkingscertificaat apart, zodat je de sleutel kunt buiten gebruik stellen als de privésleutel verloren raakt of wordt blootgesteld. Vergelijk de vingerafdruk via een vertrouwd kanaal voordat je een openbare sleutel publiceert.
