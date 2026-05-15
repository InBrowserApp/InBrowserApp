Generera UUID v4 lokalt i webbläsaren när du behöver en ny identifierare för testposter, databasrader, API-exempel, händelsenyttolaster, fixtures eller konfigurationsfiler. Verktyget skapar ett kanoniskt UUID v4 med gemener åt gången, så det håller fokus på arbetsflödet med ett enda värde utan att överlappa den separata massgeneratorn.

## Vad UUID v4 Betyder

Ett UUID v4 är en 128-bitars identifierare där versions- och variantbitarna är fasta och de återstående 122 bitarna kommer från slumpdata. Det gör det användbart när du behöver identifierare som inte avslöjar skapandetid, maskininformation, sekvensräknare eller användaruppgifter.

## När Du Ska Använda Det

Använd UUID v4 för klientgenererade ID:n, mockobjekt, tillfälliga poster, offentliga exempel och distribuerade system där det vore opraktiskt att samordna en central räknare. Det är ett bra standardval när sorteringsordning inte är viktig och du bara behöver en identifierare med låg kollisionsrisk.

## Integritet Och Tillförlitlighet

Genereringen körs i den här webbläsarfliken med Web Crypto, så UUID:t skickas inte till InBrowser.App eller någon annan tjänst. Kopiera värdet när det ser rätt ut och generera sedan igen när du behöver en ny identifierare för nästa post eller exempel.
