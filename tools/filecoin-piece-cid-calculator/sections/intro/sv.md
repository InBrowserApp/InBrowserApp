## Beräkna en Piece CID från ett CAR-arkiv eller en fil

Välj exakt den fil du tänker skicka till en Filecoin-lagringsleverantör. Välj **Beräkna Piece CID** och kopiera sedan den identifierare som ditt arbetsflöde kräver. Verktyget visar även den utfyllda piece-storleken i byte. Webbläsaren läser filen lokalt och bearbetar den i delar, så innehållet stannar på din enhet.

## Vilket format ska jag använda?

**Piece CID (v2)** följer [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Den börjar vanligtvis med `bafkzci` och innehåller information om nyttolastens storlek som nyare Filecoin-verktyg behöver. **Äldre CommP (v1)** börjar vanligtvis med `baga6ea4` och används i traditionella Filecoin-lagringsavtal. Om arbetsflödet kräver en äldre Piece CID och utfylld piece-storlek kopierar du det äldre åtagandet och använder storleken som visas intill. Du kan klistra in något av formaten för att jämföra ett befintligt åtagande med filen. En äldre CommP kan matcha filer som bara skiljer sig åt genom avslutande nollor.

## Varför ser min IPFS-CID annorlunda ut?

En IPFS rot-CID identifierar ett block eller roten till en fil eller katalog. En Filecoin Piece CID är ett åtagande till lagringsnyttolastens exakta byte efter att Filecoins regler för utfyllnad och hashning har tillämpats. Om nyttolasten är ett CAR-arkiv beräknar du åtagandet från själva arkivet. Två CAR-arkiv kan ha samma IPFS rot-CID men lagra block i olika ordning, vilket kan ändra Piece CID:n. Använd exakt samma fil som vid beräkningen innan du skickar in ett avtal.

Se [Filecoins Piece-specifikation](https://spec.filecoin.io/systems/filecoin_files/piece/) för reglerna för format och utfyllnad.
