## Jak wyszukać metadane NFT według adresu kontraktu i ID tokena

Wklej adres z głównej sieci Ethereum w polu **Adres kontraktu** i wpisz **ID tokena**. Następnie wybierz **Pokaż metadane**. ID tokena możesz zapisać jako liczbę dziesiętną, na przykład `1`, lub szesnastkową, na przykład `0x1`. Wybierz **Wypróbuj przykład**, aby zobaczyć pełny wynik wyszukiwania. Narzędzie wysyła z przeglądarki zapytanie Ethereum RPC tylko do odczytu. Metadane publicznego tokena możesz więc sprawdzić bez podłączania portfela.

## Gdzie znaleźć URI tokena, obraz, cechy i JSON

Narzędzie odczytuje `tokenURI` dla ERC-721 lub `uri` dla ERC-1155. Pole **URI tokena** zawiera ciąg znaków zwrócony przez kontrakt. Narzędzie odczytuje metadane z tego adresu i pokazuje obraz, nazwę oraz cechy, jeśli te pola są dostępne. W sekcji **Źródłowy JSON** możesz podejrzeć lub skopiować odpowiedź w oryginalnej postaci. Obsługiwane są IPFS, HTTP, Arweave oraz dane JSON osadzone w URI typu data.

## Jak działa podstawianie ID tokena w ERC-1155

Kontrakt ERC-1155 może zwrócić jeden szablon wspólny dla wielu tokenów. Narzędzie zastępuje `{id}` identyfikatorem tokena zapisanym za pomocą 64 małych znaków szesnastkowych z zerami wiodącymi, bez prefiksu `0x`. Po podstawieniu pole **URI po podstawieniu ID** pokazuje adres, z którego narzędzie pobrało dane tokena. Ta sama reguła działa też w polach podglądu, na przykład w linku do obrazu.

## Dlaczego widzę URI tokena, a obraz jest niedostępny?

Kontrakt może zwrócić URI nawet wtedy, gdy host internetowy lub brama IPFS jest tymczasowo niedostępna. Jeśli metadanych nie uda się odczytać, nadal możesz skopiować URI. Jeżeli JSON jest dostępny, sprawdź pole `image` i spróbuj otworzyć jego adres bezpośrednio. Hosty HTTP mogą ograniczać żądania z innych źródeł, co wpływa na dane dostępne dla przeglądarki.

Opisy pól używanych przez aplikacje NFT znajdziesz w [standardzie ERC-721](https://eips.ethereum.org/EIPS/eip-721), [specyfikacji metadanych ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) i [przewodniku OpenSea po metadanych](https://docs.opensea.io/docs/metadata-standards).
