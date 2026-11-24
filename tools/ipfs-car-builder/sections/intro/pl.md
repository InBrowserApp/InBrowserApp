## Jak utworzyć plik CAR z plików lub folderu

Wybierz pliki lub folder, a następnie kliknij **Utwórz CAR**. Skopiuj główny CID i zapisz archiwum `.car`. Przeglądarka odczytuje wybrane pliki na Twoim urządzeniu i pakuje je do archiwum CARv1 z elementem głównym w formacie UnixFS. Archiwum możesz zachować jako kopię zapasową lub zaimportować do węzła IPFS albo usługi przechowywania danych.

## Jak archiwum zachowuje strukturę plików

Jeśli wybierzesz jeden plik, stanie się on elementem głównym. Przy kilku plikach elementem głównym jest wspólny folder. Jeśli wybierzesz folder, ścieżki zapisanych w nim plików zostaną zachowane. Podczas wyboru folderu przeglądarka przekazuje narzędziu pliki wraz z ich ścieżkami. Jeśli Twoja przeglądarka obsługuje przeciąganie folderów, upuść folder, aby zachować również puste podfoldery.

## Co oznacza główny CID

Główny CID identyfikuje spakowany plik lub folder. Narzędzie używa tych samych domyślnych ustawień CIDv1 co kalkulator CID IPFS. Przy tej samej strukturze plików otrzymasz ten sam identyfikator treści. Aby dodać archiwum do Kubo, uruchom polecenie `ipfs dag import archive.car`, podając nazwę pobranego pliku. [Dokumentacja poleceń Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
