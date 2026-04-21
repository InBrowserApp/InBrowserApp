## Do czego sluzy to narzedzie

Uzyj tego narzedzia, aby dekodowac ciagi Base58 lub pliki tekstowe z powrotem do
oryginalnych bajtow bezposrednio w przegladarce. Przydaje sie wtedy, gdy chcesz
sprawdzic dane skopiowane z API, portfeli, logow, przeplywow QR albo krokow
importu i eksportu bez wysylania ich na serwer.

## Kiedy zmienic alfabet

Base58 nie ma jednego uniwersalnego alfabetu. Bitcoin, Flickr i Ripple uzywaja
innej kolejnosci znakow. Jesli wartosc nie przechodzi walidacji albo dekoduje sie
na bledny wynik, przelacz alfabet na ten, ktory stosuje system zrodlowy.

## Na co uwazac

Panel wynikow pokazuje podglad UTF-8 tylko wtedy, gdy zdekodowane bajty da sie
odczytac jako tekst. W przypadku danych binarnych lub nietekstowych bezpieczniej
pobrac plik .bin i sprawdzic oryginalne bajty. Spacje i znaki nowej linii w
wklejonej wartosci sa ignorowane, wiec mozna dekodowac rowniez wartosci lamane w
mailach, dokumentach i terminalach.
