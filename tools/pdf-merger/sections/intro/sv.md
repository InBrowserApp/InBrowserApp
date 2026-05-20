# Slå ihop PDF-filer i din webbläsare

Använd den här PDF-sammanslagningen när du behöver ett dokument från flera käll-PDF:er, till exempel för att kombinera skannade sidor, sammanfoga signerade formulär eller paketera rapporter för delning. Lägg till två eller fler filer, granska deras sidantal och ordna sedan kön innan du skapar den slutliga PDF-filen.

## Så fungerar sammanslagningsordningen

Verktyget lägger till varje sida från den första PDF-filen, sedan varje sida från nästa PDF-fil, och fortsätter nedåt i kön. Du kan ändra filordningen med pilkontrollerna, dra rader på dator, ta bort misstag och förhandsvisa varje källfil före sammanslagningen.

## Integritet och filhantering

All tolkning och sammanslagning körs lokalt i din webbläsare med `pdf-lib` och en bakgrundsarbetare. Dina filer laddas inte upp till InBrowser.App, och den genererade nedladdningslänken finns bara i den aktuella webbläsarsessionen.

## Begränsningar att känna till

Krypterade eller skadade PDF-filer kan inte slås ihop tillförlitligt. Om en fil skyddas av ett ägarlösenord ska du först ta bort den begränsningen och sedan lägga till den upplåsta PDF-filen igen. Mycket stora filer kan ta längre tid eftersom webbläsaren måste kopiera varje sida till ett nytt dokument.
