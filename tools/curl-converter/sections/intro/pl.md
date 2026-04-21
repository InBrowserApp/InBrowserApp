## Czym jest konwerter cURL?

Konwerter cURL zamienia polecenie cURL na gotowy do użycia kod dla wielu języków i klientów HTTP. Jest przydatny, gdy dokumentacja API, narzędzia deweloperskie przeglądarki albo historia terminala dają już działające żądanie, a Ty chcesz przenieść je do kodu aplikacji bez ręcznego odtwarzania metody, URL-a, nagłówków, ciasteczek czy treści.

**Uznanie**
Oparty na [curlconverter](https://curlconverter.com) autorstwa Nick Carneiro.

## Kiedy to narzędzie jest przydatne

- Gdy zaczynasz od działającego przykładu cURL w dokumentacji API lub historii terminala.
- Gdy chcesz porównać to samo żądanie między `fetch`, Python `requests`, Go, Java, PHP i innymi celami przed wyborem.
- Gdy chcesz szybko wygenerować bazę, a potem dodać obsługę błędów, ponowne próby, odświeżanie uwierzytelniania i konfigurację projektu.

## Co sprawdzić po konwersji

- Upewnij się, że wybrany cel odpowiada bibliotece HTTP i środowisku uruchomieniowemu faktycznie używanym w projekcie.
- Czytaj ostrzeżenia uważnie. Niektóre reguły cytowania w shellu, zmienne środowiskowe lub nieobsługiwane flagi cURL mogą wymagać ręcznej poprawki.
- Zastąp przykładowe tokeny, sekrety lub przykładowe adresy URL przed zatwierdzeniem wygenerowanego kodu.
