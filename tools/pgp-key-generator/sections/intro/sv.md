# PGP-nyckelgenerator

Använd det här verktyget för att skapa ett OpenPGP-nyckelpar direkt i din webbläsare. Det skapar en armerad offentlig nyckel, privat nyckel, återkallelsecertifikat, nyckel-ID och fingeravtryck så att du kan konfigurera krypterad e-post, filkryptering, versionssignering eller arbetsflöden för kontoåterställning utan att skicka nyckelmaterialet till en server.

## När du ska använda det

PGP-nycklar är användbara när du behöver asymmetrisk kryptografi: andra använder din offentliga nyckel för att kryptera data till dig eller verifiera signaturer, medan din privata nyckel dekrypterar data och skapar signaturer. En webbläsarbaserad generator är praktisk för korta konfigurationssessioner, demonstrationer eller lokala arbetsflöden där du vill få resultatet direkt.

## Så genererar du ett nyckelpar

Ange ett namn, en e-postadress eller båda så att nyckeln får ett igenkännbart användar-ID. Lägg till en valfri kommentar om du vill skilja mellan nycklar för arbete, projekt eller versionssignering. Välj ECC för modern OpenPGP-programvara, eller RSA när du behöver kompatibilitet med äldre verktyg. En lösenfras är valfri, men rekommenderas starkt för alla privata nycklar som du tänker behålla.

## Nyckeltyper och utgång

ECC använder Curve25519 och är standard eftersom det är kompakt och snabbt. RSA finns tillgängligt med 2048, 3072 och 4096 bitar för kompatibilitet. Utgång anges i dagar; använd 0 endast för nycklar som du aktivt hanterar och kan återkalla. Kortare utgångsperioder minskar långsiktig risk och gör rotationsrutiner enklare.

## Hantera privata nycklar säkert

Ladda ner den offentliga nyckeln, den privata nyckeln och återkallelsecertifikatet som separata filer. Säkerhetskopiera den privata nyckeln i en krypterad lösenordshanterare eller säker offline-lagring, och förvara återkallelsecertifikatet på en separat plats så att du kan ta nyckeln ur bruk om den privata nyckeln förloras eller exponeras. Innan du publicerar en offentlig nyckel bör du jämföra fingeravtrycket via en betrodd kanal.
