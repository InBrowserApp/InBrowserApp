## Vad det här verktyget gör

Det här verktyget kombinerar CIDR-block till den minsta ekvivalenta mängden och drar sedan bort alla CIDR-block som du lägger i exkluderingslistan. Det stöder IPv4 och IPv6 i samma körning, och all bearbetning sker lokalt i din webbläsare.

## Så fungerar sammanslagning och exkludering

Sammanslagningslistan normaliseras först: värdbitar nollställs, överlappande nätverk slås ihop och intilliggande nätverk komprimeras när de kan representeras av ett kortare CIDR-block. Därefter dras exkluderingslistan bort från de sammanslagna intervallen. Den slutliga utdatan expanderas tillbaka till den minimala CIDR-lista som exakt täcker det som återstår.

## När detta är användbart

Använd det när du rensar brandväggsregler, förbereder poster för molnbaserade säkerhetsgrupper, granskar VPN-tillåtelselistor, sammanfattar routningstabeller eller tar bort reserverade intervall från en större tilldelning. Det är särskilt användbart när kopierad konfiguration innehåller överlappande block eller när ett brett nätverk behöver få några mindre intervall borttagna.

## Indataanteckningar

Ange en CIDR per rad, eller separera flera CIDR:er med komman. IPv4- och IPv6-block kan klistras in tillsammans, men exkluderingar gäller bara block från samma adressfamilj. Ogiltiga poster rapporteras med sin lista och sitt radnummer så att du kan rätta stora inklistrade indata utan att gissa.
