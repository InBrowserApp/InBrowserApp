## Converter um modelo glTF em um único arquivo GLB

Clique em **Abrir arquivos** para selecionar o modelo `.gltf`, os buffers `.bin` e as texturas juntos. Se as texturas estiverem em subpastas, clique em **Abrir pasta** para que o conversor possa seguir os caminhos indicados no modelo. A ferramenta também aceita arquivos glTF com dados já incorporados. Clique em **Experimentar um exemplo** para converter uma pirâmide animada e depois em **Baixar GLB**. Os arquivos são processados no navegador.

## Adicionar um buffer ou uma textura que falta

Um arquivo JSON `.gltf` pode fazer referência a recursos como `model.bin` ou `textures/albedo.png`. O conversor lista os caminhos dos arquivos que faltam. Clique em **Adicionar arquivos** para fornecer os recursos ausentes sem fechar o modelo. Mantenha os nomes originais. Se houver arquivos com o mesmo nome em pastas diferentes, selecione a pasta que contém o modelo e os arquivos referenciados para manter seus caminhos.

## Compartilhar e inspecionar o GLB

O GLB incorpora a geometria, as texturas compatíveis e os demais dados padrão referenciados pelo modelo. As malhas, os materiais e os clipes de animação são preservados. O conversor mantém a codificação das texturas e a compressão original das malhas. O programa de destino precisa aceitar esses formatos. Texturas PNG e JPEG são compatíveis com mais programas glTF. Abra apenas o arquivo baixado no [Visualizador de GLB / glTF](../gltf-viewer/) para conferir as dimensões, os materiais e a animação. [Formato de arquivo glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
