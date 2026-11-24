## Vis og rediger binærfiler på nett

Åpne eller slipp en lokal fil i hex-editoren, eller velg **Prøv et eksempel** for å se hvordan bytene vises. Du kan undersøke starten av en fil, sjekke en filsignatur som `89 50 4E 47` for PNG, se byte uten utskrivbare ASCII-tegn eller rette en verdi på en bestemt posisjon.

## Les forskyvninger, heksadesimale byte og ASCII

Forskyvningen til venstre viser posisjonen til den første byten på raden, regnet fra null. I midten vises hver byte med to heksadesimale sifre, fra `00` til `FF`. ASCII-kolonnen viser de utskrivbare tegnene som svarer til de samme bytene, med punktum for øvrige verdier. For eksempel vises `48 65 6C 6C 6F` som `Hello`.

Skriv inn en heksadesimal forskyvning som `1A` eller `0x1A` for å gå rett til byteposisjon 26. Bruk sideknappene for å se bytene i nærheten. Editoren leser én side om gangen, slik at du kan undersøke en liten del av en stor fil.

## Overskriv byte og lagre en kopi

Velg en heksadesimal byte og skriv to sifre. Editoren oppdaterer det tilsvarende ASCII-tegnet og går videre til neste byte. Bruk piltastene til å flytte mellom bytene, og velg **Angre** eller **Gjør om** for å gå tilbake eller frem i endringshistorikken. Når du overskriver en byte, beholder filen samme størrelse, og de andre bytene beholder posisjonene sine.

Velg **Last ned kopi** for å lagre resultatet. Den opprinnelige filen forblir uendret, og all lesing og redigering skjer i nettleseren.
