## Sprawdź częstotliwości w pliku audio

Użyj analizatora widma, aby znaleźć niski przydźwięk, porównać składowe częstotliwościowe nagrań lub sprawdzić, gdzie w nagraniu zanikają wysokie tony. Wykres pokazuje częstotliwość w hercach (Hz) i poziom w decybelach względem pełnej skali cyfrowej (dBFS). Piki wskazują pasma o największej energii w badanym nagraniu.

## Jak wyświetlić widmo dźwięku?

1. Wybierz lub przeciągnij plik WAV, MP3, M4A, FLAC albo OGG w mono lub stereo. Obsługiwane kodeki zależą od przeglądarki.
2. Sprawdź dominującą częstotliwość, a następnie wskaż lub dotknij punktu na wykresie, aby odczytać inną częstotliwość i jej poziom. Za pomocą klawiatury możesz uzyskać te same odczyty, przesuwając suwak.
3. W razie potrzeby przełącz skalę na logarytmiczną lub liniową. Podczas przeglądania wykresu możesz odtworzyć nagranie źródłowe. Analiza i odtwarzanie odbywają się na Twoim urządzeniu.

## Jak czytać wykres FFT?

Narzędzie dekoduje dźwięk z częstotliwością próbkowania 48 kHz. Pobiera krótkie fragmenty z całego pliku, stosuje okno Hanna i analizuje widmo za pomocą szybkiej transformaty Fouriera (FFT). Oblicza średnią moc i łączy kanały stereo na podstawie mocy. Dzięki temu na wykresie widać również dźwięki o różnych fazach w obu kanałach. Wykres sięga 24 kHz. Odczyty dotyczą poszczególnych przedziałów częstotliwości, dlatego różnią się od ogólnej głośności, szczytowego poziomu próbek i głośności zintegrowanej w LUFS.

Ostry pik w pobliżu 50 lub 60 Hz może oznaczać przydźwięk sieciowy. Nagły spadek poziomu wysokich częstotliwości może wynikać z filtrowania lub kompresji. Pojedynczy pik może odpowiadać składowej harmonicznej. Sprawdź sąsiednie piki, zanim użyjesz go do określenia wysokości dźwięku.

## Kiedy używać skali logarytmicznej lub liniowej?

Skala logarytmiczna daje więcej miejsca niskim i średnim częstotliwościom i ułatwia śledzenie oktaw. W skali liniowej jednakowe różnice w hercach mają tę samą szerokość, co ułatwia porównywanie równo rozmieszczonych składowych harmonicznych. Ten wykres podsumowuje zawartość częstotliwościową całego nagrania. Spektrogram pozwala sprawdzić, kiedy pojawia się dźwięk i jak jego częstotliwość zmienia się w czasie.
