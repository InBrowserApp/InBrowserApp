## Jak powiększyć obraz za pomocą AI

1. Wybierz lub upuść obraz w formacie JPG, PNG albo WebP. Użyj najlepszej dostępnej kopii, nawet jeśli jest mała.
2. Wybierz **2×** lub **4×** i sprawdź wymiary wyniku. Obraz o wymiarach 400 × 300 będzie miał 800 × 600 po powiększeniu 2× lub 1600 × 1200 po powiększeniu 4×.
3. Kliknij **Powiększ obraz**, a następnie przesuń suwak porównania, aby przyjrzeć się krawędziom i teksturom. Pobierz wynik jako bezstratny plik PNG.

## Czym jest superrozdzielczość obrazu z AI?

Superrozdzielczość zwiększa liczbę pikseli na szerokość i wysokość obrazu o niskiej rozdzielczości. InBrowser.App korzysta z wytrenowanego modelu Real-ESRGAN, który na podstawie dostępnych pikseli odwzorowuje drobniejsze krawędzie i tekstury. Dzięki temu małe zdjęcia, ilustracje i skompresowane obrazy z internetu mogą po powiększeniu wyglądać wyraźniej. Na podglądzie przyjrzyj się twarzom, małym napisom i drobnym wzorom. Model szacuje nowe szczegóły, więc mogą się one różnić od tego, co rzeczywiście przedstawiała pierwotna scena.

## Kiedy wybrać powiększenie 2×, a kiedy 4×?

Wybierz 2×, gdy wystarczy niewielkie powiększenie, na przykład gdy chcesz wstawić miniaturę do większego projektu. Wybierz 4×, gdy potrzebujesz znacznie większego obrazu, na przykład gdy chcesz wyświetlić mały skan w większym formacie. Podwojenie każdego boku daje cztery razy więcej pikseli. Czterokrotne zwiększenie każdego boku daje ich szesnaście razy więcej. Możesz użyć obrazu o bokach do 2048 pikseli i łącznej rozdzielczości do 1 megapiksela.

## Czy powiększanie odbywa się na moim urządzeniu?

Tak. Gdy po raz pierwszy rozpoczniesz powiększanie, przeglądarka pobierze model Real-ESRGAN. Przetwarza ona obraz na Twoim urządzeniu przy użyciu WebGPU, jeśli jest dostępne. Może też użyć procesora za pośrednictwem WebAssembly. Pierwsze uruchomienie może potrwać dłużej, a czas przetwarzania zależy od wielkości obrazu i urządzenia. Obraz cały czas pozostaje na Twoim urządzeniu.
