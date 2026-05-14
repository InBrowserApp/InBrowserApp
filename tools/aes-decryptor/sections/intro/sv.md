AES-dekryptering återställer klartext från data som krypterats med samma AES-nyckelmaterial. Det här verktyget är utformat för JSON-omslaget som skapas av InBrowser.App:s AES-krypterare. Omslaget håller algoritmen, inställningar för nyckelhärledning, salt, IV, chiffertext och metadata för klartexten samlade, medan lösenordet eller den råa nyckeln hålls separat.

Allt arbete sker lokalt med webbläsarens Web Crypto API. Krypterad JSON, lösenord, rå nyckel och dekrypterat resultat laddas inte upp.

## När du bör använda det här verktyget

Använd det när någon ger dig ett `inbrowser-aes-v1` JSON-omslag eller när du behöver återställa en anteckning, token, konfigurationssnutt eller fil som du tidigare krypterade med motsvarande AES-krypterarsida.

Om omslaget skapades med ett lösenord anger du samma lösenord, så återanvänder verktyget den lagrade PBKDF2-hashen, iterationsantalet, saltet, AES-läget och nyckellängden. Om omslaget skapades med en rå nyckel klistrar du in den hexadecimala nyckeln med exakt den längd som registrerats i omslaget.

## Praktiska anteckningar

AES-GCM autentiserar krypterade data, så fel nycklar eller ändrad JSON bör misslyckas i stället för att returnera ändrad klartext. AES-CBC och AES-CTR kan dekryptera kompatibla omslag, men de autentiserar inte chiffertext på egen hand.

Håll lösenordet eller den råa nyckeln åtskild från JSON-omslaget. Alla som har både omslaget och nyckelmaterialet kan återställa klartexten. För filomslag använder den återställda nedladdningen det ursprungliga filnamnet och medietypen som lagras i JSON.
