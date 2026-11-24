## Graphviz DOT grafını çevrimiçi önizleyin

Bir dosya, betik veya belgeden aldığınız DOT kaynak kodunu **DOT kodu** alanına yapıştırın. Yazdıkça graf güncellenir. Yönlü kenarlar için `digraph` ve `->`, yönsüz kenarlar için `graph` ve `--` kullanın. Bağımlılıkların, ağların ve kümelerin nasıl tanımlandığını görmek için bir örnek seçin.

## Graphviz yerleşim motoru seçin

Derleme bağımlılıkları gibi katmanlı graflar için `dot` ile başlayın. Yönsüz bir ağın düğümlerini dağıtmak için `neato` ya da `fdp`, daha büyük ağlar için `sfdp`, dairesel yerleşim için `circo` veya radyal ağaç için `twopi` motorunu deneyin. Graphviz ayrıca kümeli graflar için `osage` ve ağaç haritaları için `patchwork` sunar. Yerleşim motorunu değiştirseniz de DOT kodu düzenleyicide kalır.

## Yerleşim notlarını ve söz dizimi hatalarını anlayın

Kenar işleci graf türüyle uyuşmadığında veya süslü ayraç ya da tırnak eksik olduğunda Graphviz hata verebilir. Belirtilen satırı ve bir önceki satırı kontrol edin. Graphviz bazen önizlemenin yanında uygulayamadığı öznitelikleri de listeler. Graf kendi `layout` özniteliğini tanımlıyorsa Graphviz orada belirtilen motoru kullanır. Ayrıntılar için [DOT dil başvurusuna](https://graphviz.org/doc/info/lang.html) ve [Graphviz yerleşim kılavuzuna](https://graphviz.org/docs/layouts/) bakın.

## Grafı SVG olarak indirin

Geçerli yerleşimi vektör görseli olarak kaydetmek için **SVG indir** seçeneğini kullanın. **Ekrana sığdır** ve **Gerçek boyut** yalnızca önizlemeyi değiştirir. Grafı daha sonra düzenlemek için DOT kodunu saklayın.
