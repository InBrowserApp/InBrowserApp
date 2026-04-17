## Czym jest numer VAT UE?

Numer identyfikacyjny VAT jest nadawany przez państwo członkowskie UE firmom zarejestrowanym jako podatnicy podatku od wartości dodanej. Zaczyna się od dwuliterowego kodu kraju (na przykład `BE` dla Belgii lub `EL` dla Grecji), po którym następuje charakterystyczna dla danego kraju sekwencja cyfr, a czasem liter. Organy podatkowe wykorzystują go do śledzenia handlu transgranicznego i rozliczeń zwrotów, więc błędy na fakturach, w umowach lub dokumentach zakupowych mogą łatwo zablokować płatność albo uruchomić kontrolę.

## Co właściwie sprawdza to narzędzie

Ten walidator wykonuje trzy niezależne sprawdzenia, wszystkie w Twojej przeglądarce:

1. **Kod kraju** — pierwsze dwie litery muszą odpowiadać państwu członkowskiemu UE uczestniczącemu w systemie VAT (wliczając specjalny kod `EL` używany dla Grecji).
2. **Format** — pozostałe znaki muszą być zgodne z udokumentowanym formatem VAT danego kraju. Na przykład belgijski VAT to dokładnie dziesięć cyfr, austriacki VAT zaczyna się od `U`, po którym następuje osiem cyfr, a holenderski VAT ma postać `<dziewięć cyfr>B<dwie cyfry>`.
3. **Suma kontrolna** — tam, gdzie przepisy VAT danego kraju definiują deterministyczną sumę kontrolną (Austria, Belgia, Dania, Finlandia, Francja, Niemcy, Włochy, Holandia, Polska, Portugalia, Hiszpania, Szwecja), ostatnia cyfra lub litera jest przeliczana i porównywana.

Numer, który przejdzie wszystkie trzy sprawdzenia, jest poprawny składniowo. To nie to samo, co potwierdzenie, że firma jest aktualnie zarejestrowana — do tego wciąż potrzebna jest usługa VIES Komisji Europejskiej lub lokalny urząd skarbowy. To narzędzie najlepiej sprawdza się przed tym finalnym krokiem, wyłapując literówki, zamienione cyfry i błędy kopiuj-wklej, które powodują, że zapytanie VIES kończy się niepowodzeniem z niewłaściwego powodu.

## Typowe błędy, które wychwytuje

- Numery, które na pierwszy rzut oka wyglądają poprawnie, ale pochodzą z kraju spoza systemu (na przykład zaczynające się od `US` lub `UK`).
- Wiodące zera przycięte przez arkusz kalkulacyjny, co daje numer krótszy o jedną cyfrę.
- Spacje, kropki lub myślniki wklejone przez system fakturowania — narzędzie normalizuje je i sprawdza wynik.
- Klasyczne pomylenie greckiego `GR` z VAT-owskim `EL`, które sprawdzenie formatu od razu odrzuca.

## Co pokazuje karta wyniku

Poza prostą odznaką prawidłowy/nieprawidłowy, wynik rozbija informację na kraj, znormalizowany numer, format oczekiwany przez dany kraj oraz to, czy suma kontrolna przeszła, nie zgadza się, czy została pominięta, bo kraj jej nie publikuje. Ten poziom szczegółów jest przydatny, gdy trzeba wyjaśnić odrzucenie — „format jest w porządku, suma kontrolna się nie zgadza" jest znacznie bardziej konkretne niż „nieprawidłowy".

## Prywatność

Każde sprawdzenie odbywa się lokalnie w Twojej przeglądarce. Nic nie jest wysyłane na serwer, logowane ani przechowywane gdziekolwiek poza localStorage Twojej przeglądarki (dla ostatnio wpisanej wartości, aby przetrwała przeładowanie strony). Możesz wkleić numer VAT klienta bez obaw o to, gdzie trafi.
