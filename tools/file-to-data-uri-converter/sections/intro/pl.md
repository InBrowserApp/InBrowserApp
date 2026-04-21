## Co to jest Data URI?

Data URI (lub data URL) osadza małe pliki bezpośrednio w tekście. Format: `data:[mime][;charset][;base64],data`.

**Typowe zastosowania:**

- Obrazy lub fonty inline w HTML/CSS
- Przechowywanie małych zasobów w JSON/konfigach

**Uwagi:**

- Najlepsze dla małych plików; długie ciągi mogą spowolnić stronę
- Base64 jest powszechne dla danych binarnych

### Przykład

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Część przed przecinkiem opisuje plik, na przykład jego typ MIME i to, czy używa Base64. Część po przecinku to zakodowana zawartość.

### Kiedy ten konwerter się przydaje

- Gdy chcesz zamienić lokalny plik na ciąg znaków do osadzenia w HTML, CSS, JSON lub szablonie e-maila
- Gdy chcesz szybko przygotować samowystarczalną demonstrację bez hostowania zasobu gdzie indziej
- Gdy chcesz sprawdzić wykryty typ MIME przed wklejeniem wyniku do innego narzędzia

### Ograniczenia praktyczne

- Data URI najlepiej sprawdzają się przy małych plikach, takich jak ikony, małe obrazy czy krótkie fragmenty
- Base64 dodaje około 33% narzutu, więc końcowy ciąg jest większy niż oryginalny plik
- Bardzo długie ciągi mogą być niewygodne do wklejania w formularzach, konfiguracjach lub edytorach z limitami
