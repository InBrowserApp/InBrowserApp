## Quando usar BibTeX, RIS ou CSL JSON?

Escolha um formato que o aplicativo de destino consiga importar.

- **BibTeX (`.bib`)** é um formato comum em projetos LaTeX no Overleaf ou em um editor local.
- **RIS (`.ris`)** serve para transferir referências de uma base de dados ou de outro gerenciador bibliográfico para o Zotero ou o EndNote.
- **CSL JSON (`.json`)** contém dados bibliográficos estruturados para processadores de citações e outras ferramentas compatíveis com dados no padrão Citation Style Language.

## Como converter e verificar minhas referências?

Cole as referências ou selecione **Abrir arquivo**. Deixe **Formato de entrada** em **Detectar automaticamente** ou escolha o formato manualmente se a detecção falhar. Escolha o **Formato de saída**, selecione **Converter e verificar** e copie o resultado ou baixe o arquivo. A conversão acontece no navegador.

Por exemplo, abra um arquivo RIS exportado do Zotero, escolha BibTeX e baixe um arquivo `.bib` para seu projeto no Overleaf. Se você só tem uma bibliografia formatada que copiou do Word, primeiro exporte os registros do gerenciador bibliográfico que gerou a lista. Para importar o arquivo convertido no Zotero, siga o [guia de importação do Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## O que significa uma possível duplicata?

O relatório agrupa registros com o mesmo DOI, inclusive quando ele aparece como um link de `doi.org`. Se faltar um DOI, o relatório também pode agrupar registros com base no título, no ano de publicação e no sobrenome e na inicial do nome do primeiro autor. Os números dos registros indicam a ordem em que aparecem na entrada. Selecione **Carregar exemplo** para ver como dois registros do mesmo artigo aparecem no relatório. Confira cada grupo antes de mesclar os registros no seu gerenciador bibliográfico. O arquivo baixado inclui todos os registros.

## Quais campos são mantidos?

Campos comuns como título, autores, ano de publicação e DOI geralmente são mantidos na conversão entre formatos. Campos personalizados podem ser omitidos. Ao gerar um arquivo BibTeX, a ferramenta pode atribuir novas chaves de citação para evitar conflitos. Guarde o arquivo original caso precise desses detalhes. Para verificar duplicatas e preservar os campos originais, escolha o mesmo formato de entrada e de saída.
