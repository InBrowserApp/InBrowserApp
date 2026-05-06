## Wizualne tworzenie harmonogramów cron

Wyrażenia cron są zwięzłe, ale drobna zmiana w niewłaściwym polu może
przestawić zadanie z „poranków w dni powszednie” na „co minutę”. Ten
generator daje każdemu polu własne kontrolki, dzięki czemu możesz zbudować
standardowe pięciopolowe wyrażenie bez zapamiętywania wszystkich reguł składni.

### Kiedy się przydaje

- Tworzenie harmonogramów dla zadań CI, kopii zapasowych, rozgrzewania cache'u,
  raportów i innych zadań cyklicznych.
- Zacznij od znanego presetu i dostrajaj po jednym polu naraz.
- Podejrzyj nadchodzące lokalne czasy uruchomienia przed wklejeniem wyrażenia
  do harmonogramu zadań.

### Jak go używać

1. Wybierz szybki preset albo zostaw domyślne wyrażenie i edytuj każde pole
   ręcznie.
2. Zdecyduj, czy każde pole ma działać dla każdej wartości, interwału,
   konkretnych wartości czy zakresu.
3. Sprawdź wygenerowane wyrażenie i podgląd następnych uruchomień, a następnie
   skopiuj je do swojego harmonogramu zadań.

### Uwagi

- To narzędzie generuje standardowe pięciopolowe wyrażenie cron: minuta,
  godzina, dzień miesiąca, miesiąc i dzień tygodnia.
- Niedziela jest pokazywana jako `0`, co akceptują typowe harmonogramy cron w
  stylu Unix.
- Jeśli ograniczone są jednocześnie dzień miesiąca i dzień tygodnia, wiele
  implementacji cron uruchamia zadanie, gdy pasuje dowolne z tych pól. Niektóre
  systemy działają inaczej, więc zweryfikuj tę kombinację w docelowym
  harmonogramie zadań.
