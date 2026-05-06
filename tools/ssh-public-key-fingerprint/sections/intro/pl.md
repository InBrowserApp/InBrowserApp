## What is an SSH public key fingerprint?

Odcisk klucza publicznego SSH to krótki skrót bloku klucza publicznego. Daje zwartą wartość do porównania przed zaufaniem kluczowi w `authorized_keys`, inwentarzu serwerów lub procesie wdrożenia.

OpenSSH zwykle pokazuje odciski SHA-256, takie jak `SHA256:...`. Starsza dokumentacja i niektóre audyty nadal używają odcisków MD5 rozdzielanych dwukropkami. To narzędzie pokazuje oba, aby można było dopasować nowoczesne dane wyjściowe SSH i starsze rekordy bez wysyłania klucza gdziekolwiek.

Wklej pojedynczy klucz publiczny, kilka wierszy `authorized_keys` albo blok klucza publicznego SSH2. Parser pomija komentarze i opcje authorized_keys, odczytuje właściwy blok klucza SSH i oblicza odciski lokalnie w przeglądarce.

- Sprawdź, czy skopiowany klucz publiczny odpowiada odciskowi udostępnionemu przez członka zespołu.
- Porównaj wpisy `authorized_keys` z listą dostępu do serwera.
- Sprawdź typ klucza, rozmiar klucza, krzywą i komentarz przed skopiowaniem odcisku.
