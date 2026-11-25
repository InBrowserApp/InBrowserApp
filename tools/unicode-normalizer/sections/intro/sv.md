## Så normaliserar du Unicode-text

Skriv eller klistra in text i **Originaltext** och välj sedan en normaliseringsform. Resultatet uppdateras medan du skriver eller byter form. Välj **Kopiera resultatet** för att använda den normaliserade texten i en annan app. Omvandlingen sker i webbläsaren och texten du matar in stannar på din enhet.

## Vilken Unicode-normaliseringsform ska jag välja?

- **NFC (kanonisk sammansättning)** är ett bra standardval för vanlig text. När det finns ett sammansatt tecken slår NFC ihop bokstaven och accenten till en kodpunkt. På så sätt kan du ge likvärdiga teckensekvenser samma form innan du sparar eller jämför text.
- **NFD (kanonisk uppdelning)** delar upp teckensekvenser i deras kanoniska delar, till exempel en grundbokstav och en kombinerande accent. Det är användbart när du vill granska eller bearbeta enskilda accenter.
- **NFKC (kompatibilitetssammansättning)** omvandlar även kompatibilitetsvarianter som bokstäver i fullbredd och ligaturer. Det kan underlätta vid sökning eller matchning när skillnaderna saknar betydelse.
- **NFKD (kompatibilitetsuppdelning)** gör samma kompatibilitetsomvandlingar och lämnar resultatet i uppdelad form. Det kan underlätta textanalys.

## Varför kan normaliserad text se likadan ut?

Bokstaven **é** kan lagras som `U+00E9` eller som ett **e** följt av en kombinerande akut accent (`U+0065 U+0301`). NFC ger den första representationen och NFD den andra. Öppna **Jämför kodpunkter** för att se vilka kodpunkter båda texterna börjar med, även om texterna ser likadana ut.

Välj **Prova ett exempel** för att också se tecken som ändrar utseende. Med NFKC blir **ＡＢＣ ① ﬁ** till **ABC 1 fi**. NFC bevarar de här kompatibilitetsskillnaderna.

## När kan normalisering ändra betydelsen?

Med NFKC och NFKD kan formateringsskillnader försvinna, till exempel ett upphöjt tecken i en formel eller ett inringat tal i en lista. Välj NFC om skillnaderna är viktiga. Att ändra mellan versaler och gemener, ta bort accenter och växla mellan kodningar som UTF-8 och UTF-16 är separata åtgärder.

Läs mer i [Unicode-standardens bilaga om normaliseringsformer](https://www.unicode.org/reports/tr15/).
