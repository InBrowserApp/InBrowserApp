## Sobre o conversor de legendas

Converta arquivos de legendas existentes entre 19 formatos de texto com marcações de tempo ou exporte uma transcrição em texto simples. Entre as tarefas comuns estão converter SRT em VTT para um vídeo na web, transformar diálogos de ASS ou SSA em SRT, preparar legendas para uma plataforma de vídeo e reunir vários episódios convertidos em um único ZIP. A conversão ocorre no seu navegador; os arquivos de legendas e o conteúdo colado não são enviados.

A ferramenta trabalha com o texto das legendas e seus tempos. Escolha arquivos ou cole legendas, selecione um formato de saída e use a prévia para conferir o resultado antes de baixar. Você pode editar a entrada colada e convertê-la novamente sem alterar o arquivo original no seu dispositivo.

## Como converter legendas

1. Selecione **Escolher arquivos** para abrir um ou mais arquivos de legendas, arraste arquivos para o painel de entrada ou cole o texto das legendas no editor. **Testar um exemplo** carrega uma pequena amostra SRT com duas legendas.
2. Mantenha **Formato de entrada** em **Detectar automaticamente** no uso normal. A detecção examina o conteúdo em vez de depender apenas do nome do arquivo. Selecione o formato de origem manualmente se um arquivo for ambíguo.
3. Escolha um **Formato de saída**. Para uma faixa de legendas típica de um site, escolha WebVTT; para um reprodutor ou editor que solicite um arquivo SRT, escolha SubRip.
4. Abra **Configurações de conversão** quando precisar de outra codificação de arquivo, uma taxa de quadros ou um deslocamento de tempo. Altere essas configurações antes de converter.
5. Selecione **Converter legendas**. O resultado identifica os formatos de origem e de saída, o nome do arquivo de saída e a quantidade de legendas convertidas.
6. Alterne entre **Prévia** e **Conteúdo do arquivo** e, em seguida, copie o texto convertido ou baixe o arquivo. A tabela mostra até 100 legendas; o conteúdo do arquivo e os downloads incluem o resultado completo.

**Limpar** remove da página a entrada e os resultados atuais. Escolher um novo grupo de arquivos substitui a seleção anterior. O conversor não mantém um histórico de legendas, portanto baixe os resultados que deseja guardar.

## Formatos compatíveis e precisão da saída

Todos os formatos abaixo permitem leitura e gravação, exceto TXT, que serve para exportar transcrições legíveis. Cada formato armazena o tempo de uma maneira; escolher um formato de menor precisão arredonda as marcações de tempo para as unidades que ele aceita.

| Formato                                         | Extensão  | Tempos gravados                        |
| ----------------------------------------------- | --------- | -------------------------------------- |
| SubRip                                          | `.srt`    | Milissegundos                          |
| WebVTT                                          | `.vtt`    | Milissegundos                          |
| Advanced SubStation Alpha                       | `.ass`    | Centésimos de segundo                  |
| SubStation Alpha                                | `.ssa`    | Centésimos de segundo                  |
| YouTube SubViewer                               | `.sbv`    | Milissegundos                          |
| MicroDVD                                        | `.sub`    | Quadros de vídeo                       |
| SubViewer 2.0                                   | `.sub`    | Centésimos de segundo                  |
| SAMI                                            | `.smi`    | Milissegundos                          |
| Letras LRC                                      | `.lrc`    | Centésimos de segundo nos inícios      |
| Timed Text                                      | `.ttml`   | Milissegundos                          |
| Distribution Format Exchange Profile            | `.dfxp`   | Milissegundos                          |
| YouTube SRV3                                    | `.srv3`   | Milissegundos                          |
| XML de transcrição do YouTube                   | `.xml`    | Segundos com precisão de milissegundos |
| MPL2                                            | `.mpl`    | Décimos de segundo                     |
| Spruce Subtitle, formato de texto               | `.stl`    | Quadros de vídeo                       |
| QuickTime Text                                  | `.qt.txt` | Milissegundos                          |
| JSON                                            | `.json`   | Números em milissegundos               |
| CSV                                             | `.csv`    | Números em milissegundos               |
| TSV                                             | `.tsv`    | Números em milissegundos               |
| Transcrição em texto simples, apenas exportação | `.txt`    | Sem marcações de tempo                 |

A entrada TTML também aceita arquivos iTT compatíveis. DFXP pertence à família TTML. A exportação em TTML não recria todos os perfis, layouts ou regras de estilo específicos de cada plataforma.

A extensão `.sub` pode significar MicroDVD ou SubViewer baseados em texto nesta ferramenta. VobSub binário é um formato diferente. Da mesma forma, o formato `.stl` compatível é Spruce STL baseado em texto, em vez de EBU STL binário. Escolha o formato pelo nome completo quando essas extensões forem ambíguas.

## Como escolher entre SRT, VTT, ASS e texto simples

**SRT** é uma boa opção quando um reprodutor de vídeo, editor ou formulário de envio solicita legendas SubRip. **VTT** é o formato usado pelas faixas de texto de vídeos HTML e também pode incluir configurações de legendas específicas da web. A conversão entre eles preserva o texto das legendas e os tempos em milissegundos, reconstruindo a sintaxe do arquivo.

Uma legenda SRT numerada usa uma vírgula antes dos milissegundos:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

A mesma legenda em WebVTT tem um cabeçalho de arquivo e marcações de tempo com ponto decimal:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS e SSA** são opções úteis para intercâmbio quando o próximo aplicativo exige esses formatos. A formatação compatível de negrito, itálico e sublinhado pode ser transferida entre formatos que a representam. Fontes, posicionamento na tela, comandos de desenho, animação de karaokê e outros recursos avançados de apresentação são simplificados; eventos gráficos ASS sem diálogos legíveis são ignorados. O conversor prioriza legendas legíveis, em vez de reproduzir uma animação ou um layout elaborado.

**TXT** extrai diálogos legíveis sem marcações de tempo nem estilos. Sua prévia exibe o texto exportado em vez de uma tabela de tempos. A exportação TXT não cria tempos para as legendas, não transcreve a fala nem traduz o idioma falado.

## Codificação de arquivos e texto legível

A decodificação automática de arquivos usa UTF-8 ou UTF-16 quando um marcador de ordem de bytes o identifica. Para arquivos antigos, escolha a codificação original se os caracteres aparecerem incorretamente ou se o arquivo não puder ser decodificado. As opções disponíveis incluem Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS e EUC-KR, além das opções explícitas de UTF-8 e UTF-16.

Por exemplo, experimente GB18030 para uma legenda em chinês que você sabe ter sido salva nessa codificação, ou Shift_JIS para um arquivo em japonês de um aplicativo antigo. A codificação altera a forma como os bytes existentes são lidos; ela não traduz seu significado. Converta novamente depois de selecionar uma codificação diferente. Os arquivos de legendas baixados usam UTF-8, independentemente da codificação de entrada.

## Ajuste de tempos e taxa de quadros

### Antecipar ou atrasar todas as legendas

O deslocamento de tempo é medido em milissegundos. Um valor de `1500` atrasa todas as legendas em 1,5 segundo; `-500` exibe as legendas meio segundo antes. Para uma legenda que começa em `00:00:01.250`, essas configurações produzem `00:00:02.750` e `00:00:00.750`, respectivamente.

Um deslocamento move tanto o início quanto o fim, mantendo a duração até atingir o começo da linha do tempo. Legendas deslocadas totalmente para antes de zero são removidas; uma legenda que cruza parcialmente o zero passa a começar em zero. Um deslocamento corrige um atraso constante. Ele não corrige uma faixa de legendas cuja diferença de sincronização varia ao longo do vídeo.

### Usar a taxa de quadros para marcações de tempo baseadas em quadros

MicroDVD e Spruce STL usam quadros de vídeo, portanto sua taxa de quadros determina como os quadros correspondem ao tempo decorrido. TTML também pode conter tempos baseados em quadros. Use a taxa de quadros do vídeo de origem, como `23.976`, `24`, `25` ou `29.97`, quando ela for necessária para interpretar a entrada.

Uma taxa de quadros incorporada à entrada tem prioridade quando o formato fornece esse valor. Na saída baseada em quadros, a configuração escolhida determina a taxa de quadros gravada. Alterar essa configuração não redimensiona as marcações de tempo comuns de SRT ou VTT no formato de relógio; ela altera como as marcações de tempo baseadas em quadros são interpretadas ou gravadas.

### Entender o arredondamento e os tempos de término ausentes

SRT e VTT mantêm a precisão de milissegundos. ASS, SSA, SubViewer e LRC arredondam para centésimos; MPL2 arredonda para décimos; a saída baseada em quadros arredonda para quadros. Uma legenda muito curta mantém uma duração positiva após o arredondamento. A prévia reflete os tempos do formato exportado, em vez de mostrar as marcações de tempo da entrada sem arredondamento.

LRC pode fornecer inícios sem términos. Os términos ausentes usam o próximo início distinto, ou dois segundos para a última legenda. A exportação LRC não consegue manter os intervalos originais e os tempos de término sobrepostos, e legendas com várias linhas tornam-se linhas únicas de letras de música. QuickTime Text usa marcadores na linha do tempo; SAMI e QuickTime podem reconstruir legendas sobrepostas combinando os textos em cada ponto de mudança dos tempos, portanto o resultado pode conter uma quantidade diferente de segmentos de legendas.

## Conversão em lote e downloads em ZIP

Escolha ou solte vários arquivos para convertê-los com o mesmo formato de saída e as mesmas configurações. Selecione um resultado no menu de nomes de arquivos para conferi-lo. Os arquivos que não puderem ser convertidos mantêm seus próprios erros, enquanto os resultados bem-sucedidos continuam disponíveis para download individual.

Quando pelo menos dois arquivos são convertidos com sucesso, **Baixar tudo como ZIP** reúne essas saídas. O arquivo ZIP contém apenas conversões bem-sucedidas. Revise os erros exibidos, ajuste o formato de entrada ou a codificação conforme necessário e converta novamente os arquivos restantes.

Os nomes dos arquivos de saída mantêm o nome-base da origem e usam a extensão escolhida: por exemplo, `episode01.srt` torna-se `episode01.vtt`. Se vários resultados tiverem o mesmo nome, um sufixo como ` (2)` mantém suas entradas distintas no ZIP. ZIP é uma opção de download nesta ferramenta; escolha os próprios arquivos de legendas como entrada.

## Intercâmbio em JSON, CSV e TSV

JSON usa uma matriz de objetos de legendas com valores `start` e `end` em milissegundos e uma string `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

A leitura também aceita JSON no estilo Whisper contendo uma matriz `segments`, em que os valores `start` e `end` dos segmentos estão em segundos. Essa é uma convenção de entrada separada; a exportação JSON comum continua usando milissegundos.

CSV e TSV usam os nomes de coluna `start`, `end` e `text`. Os tempos de entrada podem ser números em milissegundos ou marcações de tempo no formato de relógio. CSV coloca entre aspas os campos que contêm vírgulas, aspas ou quebras de linha; TSV usa tabulações entre as colunas. Ambas as exportações gravam números em milissegundos. Use esses formatos para transferir legendas para uma planilha ou outro fluxo de processamento de legendas.

## Perguntas frequentes

### Por que a prévia e o texto baixado parecem diferentes?

A tabela de prévia mostra o texto legível das legendas e os tempos do formato de destino. O conteúdo do arquivo mostra o arquivo serializado real, incluindo cabeçalhos, numeração, delimitadores e sintaxe de formatação compatível. Os downloads contêm todo esse conteúdo serializado, mesmo quando a tabela exibe apenas as primeiras 100 legendas.

### Por que os estilos ou o posicionamento mudaram?

Os formatos não compartilham o mesmo modelo de estilos. A formatação básica compatível é preservada quando pode ser representada; estilos avançados, posicionamento de legendas da web, animação e metadados de plataforma não são reproduzidos integralmente. Use a visualização do conteúdo do arquivo para conferir a exportação e teste-a no reprodutor ou editor em que você vai usá-la.

### Esta ferramenta pode extrair legendas de um vídeo ou de uma faixa de imagens?

Comece com um arquivo de legendas de texto existente. Primeiro, extraia do vídeo as faixas de legendas incorporadas. As faixas PGS/SUP e VobSub/IDX baseadas em imagens precisam de OCR para se tornarem texto; EBU STL binário precisa de um editor de legendas capaz de ler esse formato.

### Onde posso consultar as especificações dos formatos?

Consulte a [especificação WebVTT](https://www.w3.org/TR/webvtt1/), a [especificação TTML](https://www.w3.org/TR/ttml2/) e os [formatos de legendas compatíveis com o YouTube](https://support.google.com/youtube/answer/2734698) para conhecer a sintaxe dos arquivos e os requisitos da plataforma.
