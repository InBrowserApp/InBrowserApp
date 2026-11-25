## Converter um arquivo STL para 3MF

Selecione a **Unidade das coordenadas do STL**. Depois, clique em **Abrir arquivo** ou solte um `.stl` no conversor. A ferramenta aceita arquivos STL ASCII e binários. Clique em **Experimentar um exemplo** para converter um suporte de montagem e em **Baixar 3MF** para salvar o modelo. Se você alterar a unidade, o conversor processa novamente o arquivo atual.

## Escolher as dimensões corretas para o fatiador

O STL guarda as coordenadas sem indicar a unidade de medida. Escolha a unidade usada no arquivo original. Por exemplo, uma peça com 2 unidades de coordenadas no STL terá largura de 2 polegadas se você escolher polegadas, ou de 2 milímetros se escolher milímetros. O 3MF registra essa escala para que um fatiador compatível abra o modelo nas dimensões pretendidas.

## Conferir o modelo 3MF ou fazer a conversão inversa

O 3MF preserva os triângulos originais. O conversor registra um sólido quando a malha delimita um volume e tem faces com orientação consistente. Malhas abertas ou inconsistentes são registradas como superfícies. Use o fatiador para configurar os materiais e os parâmetros de impressão. Abra o resultado no [Visualizador de 3MF](../3mf-viewer/) para conferir as dimensões ou inspecione o original no [Visualizador de STL](../stl-viewer/). Use o [Verificador de volume e topologia da malha](../mesh-inspector/) se a malha original tiver aberturas ou outros problemas de topologia. Para fazer a conversão inversa, use o [Conversor de 3MF para STL](../3mf-to-stl-converter/). [Sobre o formato 3MF](https://3mf.io/resources/faq/)
