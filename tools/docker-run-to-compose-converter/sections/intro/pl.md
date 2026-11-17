## Co robi to narzędzie

Konwerter Docker Run do Compose przekształca jedno lub więcej poleceń `docker run` w
plik `docker-compose.yml` w przeglądarce. Możesz sprawdzić wygenerowany YAML,
skopiować go lub pobrać przed dodaniem do swojego projektu.

## Kiedy go używać

Użyj go, gdy chcesz zmienić doraźne polecenie uruchomienia kontenera w powtarzalną
definicję usługi Compose lub zobaczyć, jak porty, woluminy,
zmienne środowiskowe i flagi zasobów przekładają się na konfigurację Compose.

## Czego się spodziewać

Typowe opcje, takie jak porty, zmienne środowiskowe, zasady ponownego uruchamiania,
kontrole stanu, montowania i limity zasobów, zostają zachowane. Nieobsługiwane lub
niejednoznaczne flagi są zgłaszane jako ostrzeżenia, aby można było sprawdzić wynik
przed jego użyciem.
