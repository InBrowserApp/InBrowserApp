## Een CAR-bestand maken van bestanden of een map

Kies bestanden of een map en selecteer **CAR maken**. Kopieer de root-CID en sla het `.car`-archief op. De browser leest je selectie lokaal en verpakt die als een CARv1-archief met een UnixFS-root. Je kunt het archief bewaren als back-up of importeren in een IPFS-node of opslagdienst.

## Hoe het archief je bestanden bewaart

Eén bestand wordt de root. Meerdere bestanden delen een map als root, en bij een geselecteerde map blijven de bestandspaden behouden. De mapkiezer van de browser levert de bestanden en hun paden aan. Sleep een map naar het hulpmiddel om lege submappen mee te nemen als je browser het slepen van mappen ondersteunt.

## Wat de root-CID betekent

De root-CID identificeert het verpakte bestand of de verpakte map. De generator gebruikt dezelfde standaardinstellingen voor CIDv1 als de IPFS CID-calculator, zodat dezelfde invoerstructuur dezelfde contentidentifier oplevert. Voer `ipfs dag import archive.car` uit met de naam van het gedownloade bestand om het archief aan Kubo toe te voegen. [Kubo-opdrachtreferentie](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
