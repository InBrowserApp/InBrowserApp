## Co pokazuje to narzędzie

Narzędzie Informacje o urządzeniu zbiera szczegóły widoczne dla przeglądarki na urządzeniu, którego teraz używasz. Wyniki są pogrupowane w sekcje przeglądarki, ekranu, sprzętu, sieci, pamięci i możliwości, aby szybko pokazać, co strona internetowa może wykryć bez instalowania oprogramowania diagnostycznego.

## Kiedy pomaga

Użyj go, gdy trzeba debugować układy responsywne, odtworzyć zgłoszenia pomocy technicznej, porównać przeglądarki, potwierdzić dostępność plików cookie lub localStorage, sprawdzić wymiary ekranu albo przechwycić kompaktowy zrzut JSON do raportu o błędzie. Przydaje się też przed testowaniem funkcji zależnych od canvas, WebGL, schowka, Service Worker lub pamięci przeglądarki.

## Uwagi o prywatności i dokładności

Narzędzie działa w całości w przeglądarce i nie przesyła zrzutu. Przeglądarki celowo ukrywają lub zaokrąglają niektóre wartości, zwłaszcza dotyczące pamięci, CPU, GPU, sieci i danych User-Agent. Brakujące wartości zwykle oznaczają, że przeglądarka nie udostępnia danego API, strona nie działa w bezpiecznym kontekście albo ustawienie prywatności zablokowało dostęp.

## Jak czytać wyniki

Traktuj dane jako bieżący obraz środowiska widziany przez przeglądarkę, a nie gwarantowany spis sprzętu. Zmień rozmiar okna lub obróć urządzenie, a następnie odśwież zrzut, aby zaktualizować wartości viewportu, orientacji i ekranu. Użyj akcji kopiowania JSON, gdy trzeba udostępnić dokładnie zaobserwowane wartości deweloperowi lub zespołowi wsparcia.
