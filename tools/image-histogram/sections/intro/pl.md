## Jak wyświetlić histogram obrazu

Wybierz lub przeciągnij zdjęcie, zrzut ekranu albo ilustrację, a histogram pojawi się obok obrazu. Możesz też użyć przykładowego zdjęcia. Zacznij od trybu **Jasność**, żeby zobaczyć ogólny rozkład tonów. Następnie przełącz na **RGB**, aby porównać kanały czerwony, zielony i niebieski na tej samej skali. Wybierz pojedynczy kanał, jeśli chcesz przyjrzeć mu się bliżej.

## Jak odczytywać cienie, półtony i światła

Oś pozioma biegnie od 0 (najciemniejszy poziom) do 255 (najjaśniejszy). Cienie są po lewej stronie, półtony pośrodku, a światła po prawej. Im wyższy słupek, tym więcej pikseli na danym poziomie. Aby odczytać dokładną liczbę pikseli, najedź kursorem na wykres, dotknij go lub przesuń suwak poziomu klawiszami strzałek.

Szczyt przy którejś z krawędzi może oznaczać obcięcie cieni lub świateł i utratę szczegółów. Na przykład szczyt na poziomie 255 w kanale czerwonym może wskazywać obcięcie tego kanału, nawet gdy histogram jasności kończy się przed prawą krawędzią. Czysto białe tło również może utworzyć szczyt na krańcu skali, dlatego sprawdź podgląd obrazu. Wskaźniki **Cienie** i **Światła** podają odsetek przeanalizowanych pikseli o wartościach równych odpowiednio 0 i 255.

## Kiedy używać skali logarytmicznej

Na skali **liniowej** wysokość słupków jest wprost proporcjonalna do liczby pikseli. Wypróbuj skalę **logarytmiczną**, gdy duży obszar jednego koloru utrudnia odczytanie reszty histogramu. Wybór skali wpływa na wysokość słupków, a dokładną liczbę pikseli nadal można odczytać dla każdego poziomu.

## Co mierzy przeglądarka histogramów

Narzędzie zlicza piksele 8-bitowego obrazu wyrenderowanego przez przeglądarkę w oryginalnej rozdzielczości. Jasność oblicza na podstawie ważonej kombinacji kanałów czerwonego, zielonego i niebieskiego. Największą wagę ma kanał zielony. Całkowicie przezroczyste piksele są pomijane, a każdy częściowo przezroczysty piksel jest liczony raz. Wartości RGB takich pikseli mogą zostać zaokrąglone podczas renderowania. W przypadku animacji analizowana jest jedna nieruchoma klatka. Obrazy są przetwarzane na Twoim urządzeniu.
