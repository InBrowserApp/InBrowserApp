## Veja e edite arquivos binários online

Abra um arquivo do seu dispositivo ou arraste-o para o editor hexadecimal. Escolha **Abrir exemplo** para ver como os bytes aparecem. Use o editor para examinar o cabeçalho de um arquivo, conferir um número mágico como `89 50 4E 47` em um PNG, inspecionar bytes não imprimíveis ou corrigir um valor conhecido em uma posição específica.

## Entenda os deslocamentos, os bytes em hexadecimal e o ASCII

À esquerda, o deslocamento indica a posição do primeiro byte da linha, contada a partir de zero. No centro, cada byte aparece como dois dígitos hexadecimais, de `00` a `FF`. A coluna ASCII exibe os caracteres imprimíveis correspondentes e usa um ponto para os demais valores. Por exemplo, os bytes `48 65 6C 6C 6F` aparecem como `Hello`.

Digite um deslocamento hexadecimal como `1A` ou `0x1A` para ir direto ao byte na posição 26. Use os controles de página para percorrer os bytes próximos. O editor lê uma página por vez, o que permite examinar apenas a parte de um arquivo grande que interessa.

## Sobrescreva bytes e salve uma cópia

Selecione um byte na grade hexadecimal e digite dois dígitos. O editor atualiza o caractere ASCII correspondente e avança para o próximo byte. Use as teclas de seta para se mover entre bytes e **Desfazer** ou **Refazer** para reverter ou reaplicar alterações. Sobrescrever um byte preserva o tamanho do arquivo e a posição dos outros bytes.

Escolha **Baixar cópia** para salvar o resultado. O arquivo original é preservado, e toda a leitura e edição acontece no navegador.
