## Sprawdzanie siatki STL lub OBJ online

Wybierz **Otwórz plik** lub upuść w narzędziu model `.stl` lub `.obj`. Narzędzie odczytuje siatkę na Twoim urządzeniu i pokazuje pole powierzchni, objętość wewnątrz siatki oraz usterki topologii. Wybierz **Wypróbuj przykład**, aby sprawdzić zamknięty wspornik montażowy przed analizą własnego pliku.

## Odczytywanie pola powierzchni i objętości

Formaty STL i OBJ nie narzucają wspólnej fizycznej jednostki współrzędnych. W polu **Jednostka współrzędnych** wybierz jednostkę użytą podczas eksportu modelu. Pole powierzchni wyświetla się w jednostkach kwadratowych, a objętość w sześciennych. Wybór przypisuje jednostkę do zapisanych współrzędnych bez zmiany ich wartości. Przykładowy wspornik ma objętość 16 016 mm³, gdy jego współrzędne są wyrażone w milimetrach.

Pole powierzchni to suma pól wszystkich trójkątów z pliku. Powielone ściany liczą się ponownie. Jeśli siatka przejdzie kontrolę topologii, narzędzie oblicza objętość na podstawie orientacji ścian. Powierzchnie przecinające same siebie oraz nieprawidłowo zorientowane lub nakładające się powłoki mogą nadal wpływać na oszacowanie. Porównaj ważne wyniki z oryginalnym modelem bryłowym.

## Interpretowanie wyników kontroli topologii

- **Krawędź brzegowa** należy do jednego trójkąta. Krawędzie brzegowe wyznaczają otwarte brzegi, między innymi wokół otworów.
- **Krawędź non-manifold** należy do więcej niż dwóch trójkątów. **Wierzchołek non-manifold** leży na takiej krawędzi lub łączy grupy ścian, które poza tym wierzchołkiem są od siebie oddzielone.
- **Niespójna orientacja ścian** oznacza, że dwa trójkąty przechodzą wzdłuż wspólnej krawędzi w tym samym kierunku. Prawidłowo zorientowane sąsiednie ściany przechodzą wzdłuż niej w przeciwnych kierunkach.
- **Zdegenerowane ściany** mają pole powierzchni równe zeru. **Powielone ściany** powtarzają ten sam trójkąt.

Narzędzie traktuje punkty o dokładnie tych samych współrzędnych jak jeden wierzchołek. Wyznacza liczbę powłok na podstawie wspólnych krawędzi trójkątów. Jeśli znajdzie usterkę topologii, nadal wyświetla pole powierzchni i liczby wykrytych problemów. Pomagają one ustalić, co naprawić przed użyciem wyniku pomiaru objętości.

## Oglądanie i konwertowanie modelu

Obejrzyj model w 3D, również w trybie siatki, w [przeglądarce plików STL](../stl-viewer/) lub [przeglądarce plików OBJ](../obj-viewer/). Gdy następne narzędzie wymaga pliku STL, użyj [konwertera OBJ na STL](../obj-to-stl-converter/).

Jeśli raport STL pokazuje powielone ściany, ściany o zerowym polu lub niespójną orientację ścian, wybierz **Napraw STL**, aby pracować dalej z tym samym plikiem. Na stronie [Naprawa siatki STL](../stl-mesh-repair/) możesz przed pobraniem nowego pliku porównać powielone ściany i ściany o zerowym polu, orientację ścian oraz pozostałe usterki topologii.
