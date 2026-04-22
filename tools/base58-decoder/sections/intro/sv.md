## Vad verktyget ar till for

Anvand det har verktyget for att avkoda Base58-strangar eller textfiler tillbaka
till sina ursprungliga byte direkt i webblasaren. Det ar praktiskt nar du vill
inspektera data fran API:er, planbocker, loggar, QR-floden eller import- och
exportsteg utan att skicka innehallet till en server.

## Nar du bor byta alfabet

Base58 har inget universellt alfabet. Bitcoin, Flickr och Ripple anvander olika
teckenordningar. Om ett varde inte klarar valideringen eller avkodas till fel
resultat bor du byta till alfabetet som anvands av systemet som skapade vardet.

## Vad du bor tanka pa

Resultatpanelen visar en UTF-8-forhandsvisning nar de avkodade bytena kan lasas
som text. For binardata eller innehall som inte ar text ar det sakrare att ladda
ner .bin-filen och granska de exakta bytena. Blanksteg och radbrytningar i
inklistrad inmatning ignoreras, sa aven brutna varden fran e-post, dokument och
terminaler kan avkodas.
