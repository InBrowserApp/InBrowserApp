## Otwórz plik APK i odczytaj jego manifest

Upuść plik `.apk` Androida lub wybierz **Otwórz APK lub manifest**. Przeglądarka otworzy plik `AndroidManifest.xml` z pakietu, także w skompilowanym formacie binarnego XML, używanym w większości plików APK. Możesz również otworzyć wcześniej wyodrębniony manifest w formacie binarnym lub tekstowym. Wypróbuj przykładowy plik APK, aby zobaczyć przegląd i zdekodowany XML. Pliki pozostają w przeglądarce.

## Co oznaczają pola pakietu, wersji i SDK?

**Nazwa pakietu** identyfikuje aplikację na Androida. Nazwa wersji to oznaczenie wydania widoczne dla użytkowników, a kod wersji to liczba, której Android używa do ustalania kolejności aktualizacji. Minimalny poziom SDK to najniższy poziom interfejsu API Androida zadeklarowany w manifeście. Docelowy poziom SDK określa poziom interfejsu API, dla którego przygotowano aplikację. Pola pominięte w manifeście są oznaczone jako nieokreślone.

## Sprawdź uprawnienia i wyeksportuj AndroidManifest.xml

Przegląd zawiera nazwy uprawnień zadeklarowanych w pakiecie. Android ustala, które uprawnienia faktycznie przyznać na urządzeniu, na podstawie wersji systemu, ustawień aplikacji i wyborów użytkownika. Otwórz **Manifest XML**, aby sprawdzić komponenty, filtry intencji i warunkowe deklaracje uprawnień. Wybierz **Kopiuj XML** lub **Pobierz XML**, aby zachować zdekodowany plik. Odwołania do skompilowanych zasobów mogą pojawiać się jako identyfikatory, na przykład `@0x7f010001`.

[Struktura i elementy manifestu Androida](https://developer.android.com/guide/topics/manifest/manifest-intro)
