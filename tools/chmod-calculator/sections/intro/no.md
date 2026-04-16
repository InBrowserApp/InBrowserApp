## Hva er chmod?

chmod (change mode) er en Unix/Linux-kommando som brukes til a endre fil- og katalogrettigheter. Rettigheter representeres i to formater: numerisk (oktal) notasjon som 755, eller symbolsk notasjon som rwxr-xr-x. Hvert siffer i det numeriske formatet representerer rettigheter for eier, gruppe og andre henholdsvis, der 4 = les (r), 2 = skriv (w) og 1 = kjor (x). Disse verdiene legges sammen: 7 (4+2+1) betyr full tilgang, 5 (4+1) betyr les og kjor, 4 betyr kun lesing. For eksempel gir `chmod 755 script.sh` eieren fulle rettigheter mens andre far lese og kjore filen.
