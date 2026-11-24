## Så kontrollerar du en SPF-post

Klistra in värdet från en DNS-post av typen TXT, med början på `v=spf1`, och välj Kontrollera syntaxen. Om DNS visar TXT-värdet som flera strängar inom citattecken fogar du ihop dem i rätt ordning och behåller mellanslagen inuti strängarna. Verktyget visar varje mekanism och modifierare och markerar syntaxfel vid den berörda texten. Indata stannar i webbläsaren.

## Så fungerar SPF-mekanismer och kvalificerare

Med SPF (Sender Policy Framework) kan en domän ange vilka servrar som får skicka e-post för dess räkning. Den mottagande servern kontrollerar mekanismerna i tur och ordning. Exemplet `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` kontrollerar först ett IPv4-block och en leverantörs SPF-policy, följt av avslutande `-all`. Kvalificeraren anger resultatet för en matchande mekanism: pass (`+`), fail (`-`), softfail (`~`) eller neutral (`?`). Standardvärdet är `+`. Modifierare som `redirect=` skrivs med likhetstecken och saknar kvalificerare.

## Vad antalet termer med DNS-uppslagningar betyder

RFC 7208 tillåter högst 10 termer som orsakar DNS-uppslagningar under en SPF-utvärdering. Antalet här gäller möjliga termer i den inklistrade posten, till exempel `a`, `mx`, `include`, `exists`, `ptr` och en aktiv `redirect`. En `include` eller `redirect` kan leda till fler termer, och en matchande mekanism kan avsluta utvärderingen tidigare. Undersök den publicerade TXT-posten och de domäner den hänvisar till för att bekräfta den aktiva SPF-policyn och det totala antalet termer med DNS-uppslagningar.
