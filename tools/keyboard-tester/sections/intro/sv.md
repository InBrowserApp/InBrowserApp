## Så testar du ditt tangentbord

Välj **Starta testet**. Tryck ned och släpp tangenterna på ditt fysiska tangentbord en i taget. En tangent lyser så länge du håller den nedtryckt. När du släpper den syns en liten prick. Testa Ctrl, Shift och Alt på båda sidor och kontrollera det numeriska tangentbordet separat om det finns. Välj **Återställ** för att ta bort markeringarna och testa på nytt.

## Testa tangentkombinationer, rollover och ghosting

Prova en kombination du använder i ett spel eller en app. Håll till exempel ned `W`, `A`, `Shift` och `Space` (mellanslag) samtidigt. Alla fyra tangenter ska visas under **Aktuell tangentkombination**. **Flest samtidigt** visar det högsta antal tangenter webbläsaren har registrerat samtidigt under testet. Modifierartangenter räknas också.

Rollover är tangentbordets förmåga att registrera flera tangenter samtidigt. Om en tangent fungerar ensam men inte registreras i en viss kombination kan tangentbordet blockera den inmatningen. Om en tangent visas trots att du inte tryckte på den kan det vara ghosting. Prova den kombination du har problem med, eftersom olika grupper av tangenter kan bete sig olika. [Microsofts demo om ghosting på tangentbord](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Varför registreras inte en tangent?

Välj **Starta testet** igen om du klickade någon annanstans eller lämnade testområdet med Tab eller Esc. Vissa tangenter, till exempel Fn och vissa mediatangenter, hanteras av tangentbordet eller operativsystemet. Webbläsaren kan också fånga upp ett kortkommando innan sidan får det. Om en vanlig bokstavstangent aldrig registreras när du trycker på den ensam, prova den i en annan app.

## Varför lyser en annan tangent?

Bilden visar tangenternas fysiska placering på ett fullstort ANSI-tangentbord. Om du trycker på `A` på ett franskt AZERTY-tangentbord kan `Q` lysa i bilden. Under **Senaste tangent** ser du värdet från din tangentbordslayout, `a`, bredvid koden för tangentens fysiska position, `KeyQ`. På ett kompakt tangentbord räcker det att testa de tangenter som finns. [MDN:s dokumentation om fysiska tangentkoder](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
