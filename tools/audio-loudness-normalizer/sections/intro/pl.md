## Normalizuj dźwięk do docelowej wartości LUFS

Wyrównaj odczuwalną głośność odcinków podcastu, nagrań lektorskich i utworów muzycznych. Narzędzie mierzy głośność zintegrowaną całego nagrania, a następnie zmienia wzmocnienie wszystkich kanałów o tę samą wartość. Różnice między cichymi i głośnymi fragmentami pozostają zachowane. Wybierz gotowe ustawienie lub wpisz wartość LUFS wymaganą w projekcie.

## Jak znormalizować plik audio?

1. Wybierz lub przeciągnij nagranie mono albo stereo. Typowe formaty to WAV, MP3, M4A, FLAC i OGG. Dostępne kodeki zależą od przeglądarki.
2. Wybierz docelową głośność, na przykład −16 LUFS dla podcastu, −14 LUFS dla muzyki lub −23 LUFS dla materiału do emisji. Wymagania publikacji mogą się różnić. Jeśli masz specyfikację, wpisz podaną w niej wartość.
3. Porównaj pomiary przed normalizacją i po niej, odsłuchaj wynik i pobierz 16-bitowy plik WAV o częstotliwości próbkowania 48 kHz. Dekodowanie, analiza i eksport odbywają się na Twoim urządzeniu.

## Czym różnią się LUFS i rzeczywisty poziom szczytowy?

Głośność zintegrowana w LUFS opisuje odczuwalną głośność całego nagrania. Pomiar uwzględnia różną czułość słuchu na poszczególne częstotliwości i pomija fragmenty poniżej progu pomiaru. Rzeczywisty poziom szczytowy (dBTP) określa szacowany maksymalny poziom odtworzonego sygnału, który może wypaść między próbkami. Dwa utwory o podobnym poziomie szczytowym mogą brzmieć bardzo różnie pod względem głośności. Samo wyrównanie szczytów często zostawia jeden utwór wyraźnie cichszy od drugiego.

## Dlaczego wynik jest cichszy niż ustawiona wartość?

Krótki skok sygnału może osiągnąć limit −1 dBTP wcześniej, niż całe nagranie osiągnie docelową głośność. Narzędzie zmniejsza wtedy wzmocnienie i pokazuje możliwy do uzyskania wynik. Jeśli potrzebujesz głośniejszego mastera przy tym samym zapasie, ogranicz najwyższe szczyty w edytorze audio przed normalizacją. W przypadku ciszy może nie być możliwy pomiar głośności zintegrowanej.
