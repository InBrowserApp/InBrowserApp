## Läs en serie i din webbläsare

Öppna ett lokalt seriearkiv i `.cbz`-format eller släpp det i läsaren. Börja vid den första läsbara bilden, bläddra, hoppa till ett sidnummer eller bläddra bland miniatyrerna i det hopfällbara miniatyrfältet. Fokuserad läsning ger bilderna mer utrymme. Anpassa sida visar hela bilden, även breda uppslag; anpassa bredd och zoom hjälper dig att granska text och högupplösta bilder.

## Sidordning och läsriktning

Sidorna sorteras naturligt efter sina fullständiga mapp- och filsökvägar: `chapter2/page2.jpg` kommer före `chapter2/page10.jpg`, följt av `chapter10/page1.jpg`. Sorteringen använder en fast engelsk numerisk jämförelse, där exakt sökväg och position i arkivet avgör vid lika resultat. Dolda filer, `__MACOSX`-mappar och ovidkommande metadata ignoreras. ComicInfo och andra metadata ändrar aldrig denna ordning. Oläsbara bilder behåller sina sidnummer så att saknade bilder inte förkortar boken utan att det märks.

Välj läsning från vänster till höger eller höger till vänster oberoende av webbplatsens språk. Fokusera läsytan för att använda vänster- och högerpilarna i den riktningen. Page Down och Page Up går alltid framåt och bakåt; Home och End hoppar till första och sista sidan. Knapparna Föregående och Nästa avser alltid föregående och nästa numrerade sida.

## Bildformat som stöds och kompatibilitet

Sidor i JPEG, PNG, GIF, WebP och BMP stöds; AVIF beror på webbläsarens avkodare. Animerade format använder webbläsarens vanliga bildvisning. TIFF, HEIC, JPEG XL, PSD och andra bildformat som inte stöds finns kvar som oläsbara sidor. SVG-bilder visas avsiktligt inte. Filer utan känd bildfiländelse ignoreras. CBR, RAR och andra arkivfamiljer stöds inte.

Lösenordsskyddade poster kan inte öppnas. En skadad bild hindrar dig inte från att läsa andra sidor om ZIP-katalogen går att läsa. Skadade ZIP-kataloger kan hindra hela serien från att öppnas. Läsaren kontrollerar bildavkodningen när sidor och miniatyrer öppnas, så fler problem kan dyka upp medan du läser.

## Integritet och webbläsarresurser

Arkivet läses lokalt. Seriens innehåll laddas inte upp, skript körs inte och dokumentresurser hämtas inte från andra servrar. När du stänger eller byter serie frigörs dess bild-URL:er. Varken serien eller läspositionen sparas automatiskt.

Det finns inga fasta gränser för filstorlek eller sidantal. Bilddata packas upp vid behov, och miniatyrfältet visar en förskjutbar grupp sidor så att även långa serier är lätta att navigera i. Mycket stora arkiv eller bilder kan ändå förbruka allt tillgängligt minne eller alla avkodningsresurser i webbläsaren. Stäng andra flikar eller använd en enhet med mer minne om ett resursfel uppstår.
