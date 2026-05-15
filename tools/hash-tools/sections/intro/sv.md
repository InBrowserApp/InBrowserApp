Samlingen med hashverktyg samlar de migrerade hashverktygen så att du kan välja rätt algoritm innan du öppnar ett specifikt verktyg. Den omfattar vanliga hashvärden för filer, kompatibilitetskontroller för äldre system, nycklad meddelandeautentisering, Subresource Integrity-strängar, lösenordshashning, lösenordsverifiering och snabba icke-kryptografiska kontrollsummor.

## When to use these tools

Använd de kryptografiska hashverktygen när du behöver ett repeterbart fingeravtryck för text eller en fil, till exempel när du jämför ett nedladdat arkiv med en publicerad kontrollsumma med SHA-256. Använd HMAC när resultatet måste bevisa att någon med en delad hemlighet skapade eller godkände meddelandet. Använd Argon2, bcrypt, PBKDF2 eller scrypt för arbetsflöden med lösenord och nyckelhärledning, där konfigurerbar kostnad är viktigare än rå hastighet.

## Choosing safely

Alla hashfunktioner passar inte för säkerhet. MD4, MD5 och SHA-1 är användbara för äldre system och kompatibilitetskontroller, men de bör inte användas för nya säkerhetskänsliga integritetslösningar. CRC, Adler-32, MurmurHash, CityHash och xxHash är snabba kontrollsummor eller hashfunktioner för bucketindelning, inte manipulationsresistenta signaturer. När du är osäker, välj SHA-256 för offentliga kontrollsummor, HMAC-SHA-256 för nycklad verifiering och Argon2id eller bcrypt för lösenordslagring.

## Privacy and workflow

De enskilda verktygen i den här samlingen körs i webbläsaren. Text och filer bearbetas lokalt av det valda verktyget, om inte verktyget uttryckligen dokumenterar offentlig uppslagning, vilket hashverktygen inte behöver. För känsligt material bör du rensa genererade värden efter användning och undvika att klistra in hemligheter i delade eller inspelade webbläsarsessioner.
