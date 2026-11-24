Med Torrentnedladdare kan du öppna magnetlänkar för BitTorrent och `.torrent`-filer i webbläsaren. Välj en fil i torrenten, starta nedladdningen och följ hur den fortskrider. Verktyget ansluter via WebTorrent och sparar filen med hjälp av webbläsaren.

## Så laddar du ner en fil från en torrent

Klistra in en magnetlänk och välj ”Öppna torrent”, eller välj en lokal `.torrent`-fil. När fillistan visas kan du använda filtret för att hitta filen efter namn eller mappsökväg. Välj ”Ladda ner” bredvid filen. Du kan ladda ner en fil i taget och avbryta en pågående nedladdning. Låt fliken vara öppen tills filen har sparats.

## Vilka torrenter fungerar i webbläsaren?

Verktyget stöder BitTorrent v1 och hybridtorrenter med en v1-infohash. I webbläsaren kan WebTorrent ansluta till peers med stöd för WebRTC som hittas via en WebSocket-spårare. Det kan också hämta data från kompatibla webbseedrar via HTTP, om servern tillåter förfrågningar från webbläsaren. En magnetlänk kan innehålla en separat metadatakälla. Även om fillistan går att öppna kan en källa till själva filen saknas.

## Var filerna sparas och vad andra peers kan se

Verktyget körs i din webbläsare. Om webbläsaren erbjuder en dialogruta för ”Spara som” kan du välja var filen ska sparas innan överföringen börjar. Annars lämnas filen till webbläsarens nedladdningshanterare när alla data har kommit fram. Spårare, peers och webbseedrar kan se din anslutning och vilken torrent du begärde. Så länge torrenten är öppen kan WebTorrent dela delar av filer med anslutna peers. Stäng torrenten för att avsluta sessionen.
