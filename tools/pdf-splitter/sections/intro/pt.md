## O que esta ferramenta faz

O Divisor de PDF permite abrir um PDF no navegador, escolher páginas por
intervalo ou por número de página e gerar um documento menor. Você pode extrair
páginas selecionadas para um único PDF, dividir cada intervalo digitado em um
PDF separado ou dividir cada página selecionada em seu próprio arquivo e baixar
os resultados como um arquivo ZIP.

## Bons casos de uso

- Retirar algumas páginas de um contrato, relatório, manual ou digitalização
  longa antes de compartilhar com outra pessoa.
- Separar capítulos, faturas, formulários ou seções de anexos em arquivos PDF
  individuais.
- Remover páginas desnecessárias antes de enviar um documento para uma gráfica,
  central de suporte ou fluxo de aprovação.
- Criar divisões repetíveis com sintaxe de intervalos como `1-3,5,8-10` em vez
  de clicar manualmente em cada página.

## Como os intervalos de páginas funcionam

Use números de página separados por vírgulas e intervalos inclusivos.
`1-3,5,8-10` seleciona as páginas 1, 2, 3, 5, 8, 9 e 10. Uma página só pode
aparecer uma vez na expressão, e intervalos decrescentes como `7-4` são
rejeitados para que a ordem de saída continue clara e previsível.

Para um único PDF de saída, as páginas selecionadas são copiadas para um novo
documento na ordem mostrada pela expressão de intervalo. Para vários PDFs de
saída, "um arquivo por intervalo" mantém cada segmento digitado junto, enquanto
"um arquivo por página" cria um PDF separado para cada página selecionada.

## Observações de privacidade

O PDF é processado localmente no seu navegador e não é enviado por esta
ferramenta. Os links de download gerados são URLs de objeto temporárias que
existem apenas na aba atual. Revise os arquivos resultantes antes de
compartilhá-los, pois as páginas copiadas ainda podem conter metadados
incorporados, anotações, valores de formulário ou conteúdo oculto do documento
original.

## Limitações

PDFs criptografados, protegidos por senha ou danificados podem não abrir na
biblioteca de PDF executada no navegador. Este divisor copia páginas para novos
PDFs, mas não é uma ferramenta de ocultação visual e não garante a remoção de
todos os metadados do documento. Para ocultação legalmente válida, reparo de
acessibilidade ou otimização avançada, use um editor de PDF dedicado depois da
divisão.
