## Sprawdzanie binarnych danych API

CBOR i MessagePack to kompaktowe formaty serializacji binarnej danych strukturalnych. Użyj tego konwertera, aby przeglądać odpowiedzi API, wiadomości WebSocket lub wartości z pamięci podręcznej jako JSON albo tworzyć dane binarne z JSON do debugowania. Wszystko jest przetwarzane w przeglądarce; dane wejściowe nie są wysyłane ani zapisywane.

## Kodowanie JSON lub dekodowanie bajtów

Wybierz format binarny i kierunek konwersji. Aby zakodować dane, wprowadź JSON i wybierz Hex, Base64 lub Base64URL jako format wyjściowy. Aby zdekodować dane, wklej bajty i wybierz ich kodowanie wejściowe. Zmiana kodowania wejściowego powoduje ponowną interpretację tekstu znajdującego się już w edytorze.

Podczas kodowania otwórz plik JSON, a podczas dekodowania — surowy plik `.cbor`, `.msgpack` lub `.bin`. Zakodowany tekst, taki jak Hex lub Base64, należy wkleić do edytora. Wykonaj konwersję, a następnie skopiuj wyświetlany tekst lub pobierz wynik. Pobrane pliki binarne zawierają rzeczywiste bajty i można je ponownie zaimportować.

## Zachowanie wartości i ograniczenia

Literały całkowite zachowują każdą cyfrę w 64-bitowym zakresie obsługiwanym przez dany format. Wartości, których JSON nie potrafi przedstawić, takie jak pola binarne, tagi CBOR i rozszerzenia MessagePack, są wyświetlane jako jawne typowane obiekty opakowujące. Włącz rozszerzony JSON, aby ponownie zakodować te obiekty do postaci binarnej; pozostaw go wyłączonym dla zwykłych obiektów JSON, które przypadkowo używają kluczy opakowujących.

Na przykład po włączeniu rozszerzonego JSON `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` koduje dokładną liczbę całkowitą i dwa bajty binarne.

Każda konwersja obsługuje jedną wartość, z limitem danych wejściowych wynoszącym 1 MiB. Wskaźnik „Bajty sformatowanego JSON” dotyczy wyświetlanego JSON z wcięciami, a nie pierwotnych danych wejściowych. Ponowne kodowanie zachowuje obsługiwane wartości, ale może zmienić kolejność wpisów mapy lub sposób kodowania binarnego. Otwórz sekcję „Formaty i zachowanie typów” powyżej, aby sprawdzić składnię obiektów opakowujących i nieobsługiwane typy.
