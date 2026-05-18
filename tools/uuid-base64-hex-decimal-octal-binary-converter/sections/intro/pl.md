## Co konwertuje to narzędzie

Ten konwerter traktuje UUID jako 128-bitową wartość, którą faktycznie jest,
i utrzymuje popularne reprezentacje w synchronizacji. Wklej UUID, wartość
Base64, ciąg szesnastkowy, liczbę dziesiętną, wartość ósemkową albo wartość
binarną, a pozostałe formaty zaktualizują się lokalnie w przeglądarce.

## Jak odczytywać formaty

Pole UUID pokazuje kanoniczną formę z myślnikami. Zapis szesnastkowy to te same
16 bajtów jako 32 małe cyfry hex. Base64 to standardowy Base64 z dopełnieniem
dla surowych 16 bajtów, a nie Base64 dla znaków tekstowych UUID. Format
dziesiętny, ósemkowy i binarny pokazują UUID jako jedną nieujemną 128-bitową
liczbę całkowitą; wynik binarny jest uzupełniany z lewej do pełnych 128 bitów,
aby początkowe zera pozostały widoczne.

## Na co uważać

Wartości spoza 128-bitowego zakresu UUID są odrzucane. Wejście Base64 musi
dekodować się dokładnie do 16 bajtów. Konwerter akceptuje typowe wklejane
warianty, takie jak UUID z wielkimi literami, prefiksy `urn:uuid:`, nawiasy
klamrowe, zwarte 32-hex UUID, białe znaki wokół długich wartości liczbowych
i Base64 bezpieczny dla URL. Podczas konwersji lub generowania przykładowego
UUID nic nie jest przesyłane.
