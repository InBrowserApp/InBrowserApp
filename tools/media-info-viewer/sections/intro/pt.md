## O que este visualizador mostra

O Visualizador de informações de mídia lê os metadados técnicos de arquivos locais
de áudio e vídeo, incluindo MP4, MOV, MKV, WebM, AVI, MP3, FLAC e WAV. Use-o para
verificar as especificações de uma exportação, conferir as etiquetas de idioma das
faixas de áudio de um filme ou reunir um relatório técnico para investigar
problemas. A análise começa assim que você escolhe ou solta um arquivo.

## Detalhes do arquivo, vídeo, áudio e legendas

- **Visão geral do arquivo:** formato real do contêiner, tamanho do arquivo,
  duração, taxa de bits total, título e aplicativo de codificação, quando disponíveis.
- **Faixas de vídeo:** codec, perfil e taxa de bits, resolução, taxa de quadros e
  modo da taxa de quadros, proporção de exibição, rotação, profundidade de bits,
  espaço de cor, subamostragem de croma e formato HDR.
- **Faixas de áudio:** codec, taxa de bits, idioma, título da faixa, quantidade e
  disposição dos canais, taxa de amostragem, profundidade de bits e indicadores de
  faixa padrão ou forçada. Cada faixa de áudio é listada separadamente, mantendo
  distintas as faixas de áudio original, dublagem e comentários.
- **Faixas de legenda:** formato, idioma, título, duração e indicadores de faixa
  padrão ou forçada, quando incluídos no arquivo.

As principais especificações ficam visíveis de imediato. Abra **Detalhes técnicos**
em uma faixa para ver campos adicionais ou selecione um link de contagem de faixas
para ir à primeira faixa daquele tipo. Os campos disponíveis dependem do formato e
de seus metadados.

## Como inspecionar um arquivo

1. Escolha um arquivo local de áudio ou vídeo ou arraste-o para a área de arquivos.
2. Confira o resumo e depois inspecione cada faixa de vídeo, áudio e legenda.
3. Copie o relatório legível para uma mensagem ou solicitação de suporte ou baixe
   o JSON para um inventário de arquivos de mídia, um script ou análises
   adicionais. Ambos incluem campos técnicos que ficam recolhidos na interface.
4. Escolha **Trocar arquivo** para inspecionar outro arquivo ou **Remover arquivo**
   para limpar os resultados. Selecionar outro arquivo ou remover o atual também
   interrompe qualquer análise que ainda esteja em andamento.

## Como interpretar os números

- **Contêiner e codec descrevem coisas diferentes.** MP4 e Matroska são
  contêineres; AVC/H.264, HEVC/H.265 e AAC descrevem como os fluxos são codificados.
  Um contêiner pode conter várias faixas de áudio ou legenda.
- **A taxa de bits total abrange o arquivo inteiro.** Ela inclui todos os fluxos e
  os dados adicionais do contêiner. A taxa de bits de uma faixa se aplica apenas
  àquele fluxo. As taxas de bits usam kb/s ou Mb/s; os tamanhos de arquivo usam B,
  KiB, MiB, GiB ou TiB.
- **A duração inclui milissegundos.** A exibição usa `HH:MM:SS.mmm`. A taxa de
  quadros usa fps, e a taxa de amostragem de áudio usa kHz. CFR indica taxa de
  quadros constante; VFR indica taxa de quadros variável.
- **Os indicadores das faixas descrevem a seleção pretendida.** O indicador de
  faixa padrão marca uma faixa preferencial; o de faixa forçada costuma ser usado
  para legendas que devem aparecer sem que se selecione uma faixa de legenda
  completa. São indicadores independentes, informados pelo arquivo.

Alguns contêineres não fornecem uma taxa de bits separada para cada fluxo. Os
valores indisponíveis ficam ausentes ou são marcados como não disponíveis; eles
não são estimados a partir do nome do arquivo. Capas incorporadas não são contadas
como faixas de vídeo.

## Usos comuns

Confira a resolução e a taxa de quadros após exportar um vídeo, inspecione os
canais e a taxa de amostragem antes de editar um áudio, identifique faixas em
vários idiomas ou com comentários ou reúna detalhes de codecs ao investigar um
problema de reprodução. O relatório permite compartilhar as especificações
relevantes sem enviar o arquivo de mídia.

## Processamento local e exportação de relatórios

A análise ocorre no seu navegador: o arquivo de mídia não é enviado e seu conteúdo
não é alterado. O analisador lê trechos do arquivo conforme necessário, por isso
consegue inspecionar os metadados mesmo quando o navegador não consegue reproduzir
o contêiner ou codec.

**Copiar relatório** produz um resumo em texto legível. **Baixar JSON** exporta os
metadados retornados pelo analisador, junto com o nome e o tamanho do arquivo. No
JSON, `Duration` usa segundos, `BitRate` e `OverallBitRate` usam bits por segundo e
`SamplingRate` usa hertz. A interface converte esses valores em unidades mais
legíveis. A exportação também preserva campos adicionais de metadados além
daqueles exibidos nos cartões das faixas.
