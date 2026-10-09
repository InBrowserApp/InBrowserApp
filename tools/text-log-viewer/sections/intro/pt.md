## Leia textos e logs localmente

Abra um arquivo .txt, .text ou .log para lê-lo com números de linha, tamanho de texto ajustável, quebra de linha opcional e leitura focada. Vá para uma linha, para o início ou para o fim, ou use Localizar texto para pesquisar em todo o arquivo. A pesquisa é literal e diferencia maiúsculas de minúsculas; avançar e voltar nas ocorrências permite dar a volta no arquivo.

## Arquivos grandes e linhas longas

O leitor exibe uma seção por vez para facilitar a leitura de arquivos grandes. Todas as seções permanecem acessíveis, incluindo a continuação de linhas muito longas. A seleção e o comando de busca do navegador abrangem a seção atual; o comando Localizar texto do leitor pesquisa em todo o arquivo decodificado, incluindo ocorrências que atravessam os limites entre seções. Não há limite fixo de tamanho de arquivo ou número de linhas. A memória disponível no navegador ainda impõe um limite prático.

Linhas em branco, tabulações, finais de linha mistos CRLF/CR/LF e texto Unicode são preservados. Finais de linha são exibidos como quebras de linha. Marcações e sequências de escape de terminal permanecem como texto inerte. Alguns caracteres de controle não têm representação visível; arquivos com caracteres NUL recebem um aviso de arquivo binário.

## Escolha a codificação correta

O modo automático reconhece marcas de ordem de bytes UTF-8 e UTF-16 e, nos demais casos, usa UTF-8 estrito. Você pode escolher UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 ou Shift JIS. Um erro de decodificação interrompe a visualização em vez de substituir silenciosamente caracteres ilegíveis. Tente outra codificação se o arquivo estiver ilegível ou com caracteres incorretos; o visualizador não consegue determinar a codificação original de todos os arquivos.

Os arquivos são processados no seu dispositivo, sem envios, recursos remotos ou armazenamento automático. Fechar ou substituir um arquivo libera sua sessão de leitura. Este visualizador não edita arquivos, interpreta HTML ou comandos de terminal, nem acompanha um log em tempo real.
