## Wat deze tool converteert

Deze converter behandelt een UUID als de 128-bit waarde die het echt is en
houdt de gangbare representaties gesynchroniseerd. Plak een UUID,
Base64-waarde, hexadecimale tekenreeks, decimale integer, octale waarde of
binaire waarde, en de andere indelingen worden lokaal in je browser bijgewerkt.

## Hoe je de indelingen leest

Het UUID-veld toont de canonieke vorm met koppeltekens. Hexadecimaal bestaat uit
dezelfde 16 bytes als 32 kleine hexadecimale cijfers. Base64 is standaard
gepadde Base64 voor de ruwe 16 bytes, niet Base64 voor de teksttekens van de
UUID. Decimaal, octaal en binair tonen de UUID als één unsigned 128-bit integer;
de binaire uitvoer wordt links aangevuld tot alle 128 bits, zodat voorloopnullen
zichtbaar blijven.

## Waar je op moet letten

Waarden buiten het 128-bit UUID-bereik worden geweigerd. Base64-invoer moet
decoderen naar exact 16 bytes. De converter accepteert gangbare geplakte
varianten zoals UUID's met hoofdletters, `urn:uuid:`-prefixen, accolades,
compacte UUID's met 32 hex-tekens, witruimte rond lange numerieke waarden en
URL-veilige Base64. Er wordt niets geüpload terwijl je de voorbeeld-UUID
converteert of genereert.
