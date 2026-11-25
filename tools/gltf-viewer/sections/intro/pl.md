## Otwieranie modeli GLB i glTF online

Wybierz **Otwórz pliki** lub upuść model w przeglądarce plików. Plik `.glb` zapisuje scenę glTF w kontenerze binarnym i często zawiera geometrię oraz tekstury w jednym pliku. Plik `.gltf` opisuje scenę w formacie JSON i może odwoływać się do powiązanych plików. Jeśli podczas eksportu powstały pliki takie jak `model.bin` i `albedo.png`, wybierz je razem z `model.gltf`. Przeglądarka odczytuje pliki na Twoim urządzeniu.

## Sprawdzanie materiałów i odtwarzanie animacji

Przeciągnij, aby obrócić model. Użyj kółka myszy lub gestu zbliżania i rozsuwania palców, aby zmienić powiększenie. Kliknij **Pokaż cały model**, aby ponownie zobaczyć całą scenę. Włącz opcję **Siatka**, aby obejrzeć trójkąty pod materiałami. Jeśli plik zawiera klipy animacji, wybierz klip i kliknij **Odtwórz animację**. Opcja **Wypróbuj przykład** otwiera animowany model.

## Otwieranie modelu z brakującymi plikami

Gdy model odwołuje się do zewnętrznego bufora lub obrazu, zaznacz razem model i odpowiednie pliki. Zachowaj oryginalne nazwy. Jeśli model korzysta z rozszerzenia do kompresji tekstur, którego przeglądarka nie obsługuje, wyeksportuj go ponownie z teksturami w formacie PNG lub JPEG. Oba formaty plików opisuje [specyfikacja glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html).

## Otwieranie pokrewnych formatów 3D

W [przeglądarce plików OBJ](../obj-viewer/) otworzysz siatki Wavefront z materiałami MTL. [Przeglądarka plików STL](../stl-viewer/) pozwala obejrzeć siatkę trójkątów przed drukiem 3D.

- [Przeglądarka plików 3MF](../3mf-viewer/)
