## Konverter mellom Unicode-domener og Punycode

Lim inn et domene som `bücher.com` i **Unicode‑domene** for å få `xn--bcher-kva.com` i **ASCII‑domene**. Lim inn et domene med `xn--` i **ASCII‑domene** for å lese det som Unicode. Feltene oppdateres mens du skriver, og du kan kopiere begge versjonene.

## Når du bruker hver versjon

Punycode representerer tegn utenfor ASCII i internasjonaliserte domenenavn (IDN) ved hjelp av ASCII-bokstaver, sifre og bindestreker. En kodet del av domenenavnet begynner med `xn--`, mens vanlige ASCII-deler som `com` forblir uendret. Bruk ASCII-versjonen i DNS- eller webhotellinnstillinger som krever den, og Unicode-versjonen når du vil lese et domene fra en logg eller konfigurasjonsfil.

## Hva du limer inn i konverteren

Skriv bare inn vertsnavnet. For `https://bücher.com/catalog` limer du inn `bücher.com`. Underdomener støttes, så `www.bücher.com` blir til `www.xn--bcher-kva.com`.
