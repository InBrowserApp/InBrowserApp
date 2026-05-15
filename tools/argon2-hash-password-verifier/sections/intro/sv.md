## Vad är Argon2-verifiering?

Argon2-verifiering kontrollerar om ett rent lösenord producerar samma kodade Argon2-hash som lagrades tidigare. Den kodade hashen innehåller Argon2-variant, kostnadsparametrar, salt och digest, så en verifierare kan upprepa samma arbete utan separata inställningar.

## När ska detta verktyg användas?

- Bekräfta att ett kopierat lösenord och en lagrad Argon2-hash hör ihop
- Felsök inloggnings- eller migreringsproblem när lösenordsposter flyttas mellan system
- Granska varianten och kostnadsparametrarna i en kodad Argon2-hash
- Testa hashvärden som använder en valfri serverhemlighet, ofta kallad pepper

## Så verifierar du säkert

1. Klistra in lösenordet du vill kontrollera.
2. Klistra in hela den kodade hashen, till exempel en sträng som börjar med `$argon2id$`.
3. Ange hemligheten bara om den ursprungliga hashen skapades med en sådan.
4. Kör verifieringen och läs resultatet för matchning, ingen matchning eller ogiltig hash.

## Säkerhetsanteckningar

Verifieringen sker lokalt i webbläsaren, men inklistrade lösenord och hashar kan ändå finnas kvar i webbläsarens minne tills du återställer formuläret eller stänger fliken. Undvik att använda produktionsuppgifter på delade enheter. För nya system för lösenordslagring är Argon2id vanligtvis den föredragna Argon2-varianten eftersom den balanserar motstånd mot sidokanaler och GPU-angrepp.
