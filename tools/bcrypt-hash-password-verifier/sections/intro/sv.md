## Vad den gör

Verifiera om ett lösenord i klartext matchar en bcrypt-lösenordshash. Detta är användbart när du felsöker inloggningskod, kontrollerar importerade användarposter eller bekräftar att en lösenordsmigrering behöll hashar kompatibla.

## Accepterad indata

Klistra in en standard-bcrypt-hash, till exempel `$2b$10$...`, och ange lösenordskandidaten du vill testa. Verifieraren accepterar prefixen `$2a$`, `$2b$` och `$2y$` med kostnadsvärden från `04` till `31`.

## Tolka resultatet

Ett matchande resultat betyder att bcrypt accepterade lösenordet för den hashen, inklusive saltet och kostnaden som är inbäddade i hashsträngen. En avvikelse betyder att lösenordet inte kunde verifieras; det bevisar inte att själva hashen är osäker. Fel om ogiltig hash betyder vanligtvis att prefix, kostnad, längd eller bcrypt-base64-tecken är felaktigt formaterade.

## Integritets- och säkerhetsanmärkningar

- Verifieringen körs lokalt i din webbläsare.
- Lösenord och hashar lagras inte i lokal lagring.
- bcrypt är utformat för lösenordslagring, inte för allmänna filkontrollsummor.
- Använd detta verktyg för felsökning och validering, inte som den enda granskningen av ett autentiseringssystem i produktion.
