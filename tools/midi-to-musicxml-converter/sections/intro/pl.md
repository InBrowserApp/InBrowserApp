## Konwersja MIDI na edytowalny zapis nutowy

Wybierz plik .mid lub .midi, ustaw siatkę kwantyzacji i kliknij **Pobierz MusicXML**. Otwórz partyturę w edytorze nut, takim jak MuseScore Studio, Dorico lub Sibelius, aby ją poprawić albo wydrukować. Możesz też sprawdzić zapis w przeglądarce za pomocą narzędzia [Przeglądarka MusicXML](/pl/tools/musicxml-viewer/).

## Dobór siatki rytmicznej

MIDI zapisuje momenty rozpoczęcia i zakończenia nut. Podczas gry nuty mogą wypadać tuż przed uderzeniem lub zaraz po nim. Kwantyzacja wyrównuje początki i końce nut do siatki, aby dało się zapisać ich rytm. Zacznij od szesnastek (1/16). W prostszej melodii wypróbuj ósemki (1/8), a w partii, w której krótkie nuty mają pozostać rozróżnialne, wybierz trzydziestodwójki (1/32).

## Co zawiera przekonwertowana partytura

Konwerter zapisuje MusicXML z podziałem na partie (score-partwise) z plików MIDI w formacie 0 lub 1 z czasem zapisanym w impulsach na ćwierćnutę (PPQ). Rozdziela materiał na partie, grupuje nuty grane jednocześnie i przenosi tempo, metrum oraz znaki przykluczowe. Nuty perkusji General MIDI są zapisywane jako dźwięki o nieokreślonej wysokości. MIDI dostarcza przede wszystkim nuty i informacje o czasie. W edytorze nut sprawdź przedtakty, nieregularne podziały rytmiczne, takie jak triole, palcowanie i zapis enharmoniczny. Plik jest przetwarzany lokalnie w przeglądarce.
