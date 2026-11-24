## Skapa en CAR-fil från filer eller en mapp

Välj filer eller en mapp och välj sedan **Skapa CAR**. Kopiera rot-CID:n och spara `.car`-arkivet. Webbläsaren läser ditt val lokalt och paketerar det som ett CARv1-arkiv med en UnixFS-rot. Du kan behålla arkivet som säkerhetskopia eller importera det till en IPFS-nod eller lagringstjänst.

## Så bevarar arkivet dina filer

En enskild fil blir roten. Flera filer delar en katalogrot och en vald mapp behåller sina filsökvägar. Webbläsarens mappväljare tillhandahåller filerna och deras sökvägar. Dra in en mapp för att inkludera tomma undermappar om webbläsaren stöder att mappar dras och släpps.

## Vad rot-CID:n betyder

Rot-CID:n identifierar den paketerade filen eller katalogen. Verktyget använder samma standardinställningar för CIDv1 som IPFS CID-kalkylatorn, så samma indata med samma struktur ger samma innehållsidentifierare. För att lägga till arkivet i Kubo kör du `ipfs dag import archive.car` med det nedladdade filnamnet. [Kubo-kommandoreferens](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
