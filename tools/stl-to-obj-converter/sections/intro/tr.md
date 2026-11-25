## STL dosyasını Wavefront OBJ’ye dönüştürme

**Dosya aç** düğmesine tıklayın veya bir `.stl` dosyasını dönüştürücüye bırakın. Araç hem ASCII hem de ikili STL dosyalarını okur ve tarayıcınızda indirilebilir bir `.obj` dosyası hazırlar. Küçük bir montaj braketini dönüştürmek için **Örnek dene**, dosyayı kaydetmek için **OBJ indir** düğmesine tıklayın.

## OBJ dosyasında neler bulunur?

Dönüştürücü, modelin yüzeyindeki üçgenleri Wavefront OBJ dosyasına yazar. Aynı konumdaki köşeler OBJ dosyasında aynı köşe indeksini kullanır. Bu, elde edilen ağı düzenlemeyi kolaylaştırır. Koordinat eksenleri ve ağın ölçeği korunur. STL biçimi standart bir ölçü birimi tanımlamaz. Kaynak dosyadaki bir kenar 40 birim uzunluğundaysa OBJ dosyasında da 40 koordinat birimi uzunluğunda kalır. Dosyayı başka bir uygulamaya aktarırken kullanmak istediğiniz birimi seçin.

İndirilen dosya ağ geometrisini içerir. Malzeme kitaplığı ve dokular standart STL yüzey modelinin parçası olmadığı için bunlar çıktı dosyasına aktarılmaz.

## Sonucu önizleme veya ters yönde dönüştürme

Sonucu incelemek için indirdiğiniz dosyayı [OBJ Görüntüleyici](../obj-viewer/) aracında açın. Kaynak dosyayı [STL Görüntüleyici](../stl-viewer/) aracında görebilir, ters yönde dönüştürmek için [OBJ’den STL’ye Dönüştürücü](../obj-to-stl-converter/) aracını kullanabilirsiniz.
