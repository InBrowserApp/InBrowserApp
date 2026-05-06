# Vad är AES-kryptering?

AES är en symmetrisk krypteringsalgoritm, vilket betyder att samma hemlighet används för att kryptera och dekryptera data. Det här verktyget körs helt i webbläsaren och använder Web Crypto API, så klartext, lösenord och valda filer laddas inte upp.

Standardläget är AES-GCM eftersom det både krypterar och autentiserar utdatan. Autentisering är viktigt: om chiffertexten, saltet eller IV ändras senare ska dekrypteringen misslyckas i stället för att returnera ändrade data. AES-CBC och AES-CTR finns tillgängliga för kompatibilitet, men de autentiserar inte chiffertext på egen hand.

## När du bör använda det här verktyget

Använd det när du behöver skydda en anteckning, token, konfigurationssnutt eller liten fil innan du lagrar eller delar den via en annan kanal. Utdatan är ett JSON-omslag som innehåller läget, inställningar för nyckelhärledning, salt, IV och chiffertext, så dessa parametrar hålls ihop för motsvarande dekrypteringssteg.

För lösenordsbaserad kryptering bearbetas lösenordet med PBKDF2 och ett slumpmässigt salt. Öka iterationsantalet när du kan acceptera långsammare kryptering och dekryptering. För kryptering med rå nyckel klistrar du in en hexadecimal nyckel med exakt den valda längden: 32 hextecken för 128-bitars, 48 för 192-bitars eller 64 för 256-bitars.

## Praktiska anteckningar

Håll lösenordet eller den råa nyckeln åtskild från den krypterade JSON. Alla som har både JSON och nyckelmaterialet kan dekryptera data. Om du krypterar en fil, ladda ned JSON-resultatet och spara det ursprungliga filnamnet separat om den kontexten är viktig.

Återanvänd inte en manuell IV med samma nyckel. Det här verktyget genererar en ny IV och ett nytt salt för varje körning, vilket är det säkrare standardvalet. Föredra AES-GCM om inte ett annat system specifikt kräver AES-CBC eller AES-CTR.
