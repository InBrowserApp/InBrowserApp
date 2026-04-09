## SQL Formatter & Linter Nedir?

SQL Formatter & Linter, SQL sorgularınızı tarayıcınızda yeniden biçimlendirir ve aynı anda onları az sayıda ama yüksek sinyalli sorun açısından denetler. Daha temiz bir sorgu yerleşimi, tutarlı anahtar sözcük büyük/küçük harfi ve `SELECT *` ya da `WHERE` olmayan `UPDATE` ifadeleri gibi riskli kalıplar hakkında hızlı geri bildirim istediğinizde kullanışlıdır.

## Ne Zaman Kullanılır?

El yazısı SQL'i incelerken, paylaştığınızdan önce yapıştırılmış sorguları temizlerken veya farklı SQL diyalektleri arasındaki biçimlendirmeyi karşılaştırırken bu aracı kullanın. Tek başına tarayıcı içinde biçimlendirme yaparken ve SQL'inizi bir sunucuya göndermeden geçici sorgu incelemesi, pull request temizliği için iyi çalışır.

## Neleri Denetler?

Bu yeniden yazım, biçimlendirici ile linter'ı ayrı ama eşgüdümlü tutar. Biçimlendirme, diyalekt farkındalığına sahip yerleşim seçenekleriyle `sql-formatter` kullanır; lint ise ayrıştırma hatalarını, eksik noktalı virgülleri, geniş `SELECT *` kullanımını, güvensiz değişiklikleri, uzun satırları ve anahtar sözcük harf kullanımındaki sapmaları gösterir.
