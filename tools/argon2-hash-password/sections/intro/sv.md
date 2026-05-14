## Vad är Argon2?

Argon2 är en algoritm för lösenordshashning som är utformad för att göra offline-knäckning av lösenord kostsam. Den kombinerar upprepad beräkning med en konfigurerbar minneskostnad, så angripare behöver både tid och minne för varje lösenordsgissning.

**Varför Argon2id oftast är standardvalet:**

- Det balanserar skydd mot sidokanalsattacker och GPU-knäckning bättre än att använda Argon2i eller Argon2d för de flesta system som lagrar lösenord
- Den kodade utdatan lagrar algoritmen, versionen, minnet, iterationerna, parallellismen, saltet och hashen i en portabel sträng
- Ett unikt slumpmässigt salt förhindrar att identiska lösenord ger identiska lagrade hashar
- Minnes- och iterationsinställningar kan höjas när din verifieringsmiljö blir snabbare

**Så använder du verktyget:**

1. Ange lösenordet du vill hasha.
2. Behåll det genererade saltet eller skapa ett nytt slumpmässigt salt.
3. Välj Argon2-variant och justera minne, iterationer, parallellism och hashlängd för systemet som ska verifiera hashen.
4. Generera den kodade hashen och lagra hela strängen i applikationens databas.

**Säkerhetsanteckningar:**

- Lagra eller logga inte lösenordet i klartext.
- Använd ett nytt slumpmässigt salt för varje lösenord.
- Använd den valfria hemligheten bara om verifieraren också har samma hemlighet; annars kan hashen inte verifieras senare.
- Föredra de högsta minnes- och iterationsinställningarna som håller inloggningsfördröjningen acceptabel för riktiga användare.
