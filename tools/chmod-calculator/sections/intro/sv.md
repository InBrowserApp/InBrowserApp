## Vad är chmod?

`chmod` ("change mode") är ett Unix/Linux-kommando för att ändra fil- och katalogbehörigheter. Den här kalkylatorn låter dig växla mellan numeriska behörigheter som `755`, symboliska behörigheter som `rwxr-xr-x` och kryssrute-matrisen utan att räkna ut allt för hand.

## Så fungerar numeriska behörigheter

Varje siffra representerar en roll: ägare, grupp och andra. Inne i varje siffra betyder `4` läsning, `2` skrivning och `1` körning. Lägg ihop värdena för att få den behörighet du vill ha: `7 = rwx`, `6 = rw-`, `5 = r-x` och `4 = r--`. För kataloger betyder kör-biten också att du kan gå in i katalogen.

## Vanliga chmod-exempel

- `chmod 755 script.sh` ger ägaren full åtkomst och låter alla andra läsa och köra.
- `chmod 644 notes.txt` gör att ägaren fortfarande kan skriva medan andra bara kan läsa.
- `chmod 600 .env` är ett vanligt val för privata hemligheter eftersom bara ägaren kan läsa eller skriva.
- `chmod 775 shared-folder` är användbart för teamkataloger när gruppen också ska kunna skapa och ändra filer.
