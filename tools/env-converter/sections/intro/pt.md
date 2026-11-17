## Converter configurações de ambiente

Cole um arquivo `.env` e escolha JSON ou YAML, ou converta um objeto JSON/YAML plano de volta para `.env`. Importe arquivos locais, troque a entrada e a saída e copie ou baixe o resultado. Tudo funciona no seu navegador; a configuração nunca é enviada nem guardada no histórico do navegador ou no armazenamento local.

### Valores e aspas

As variáveis de ambiente são strings: `PORT=3000`, `DEBUG=false` e `CODE=0012` permanecem `"3000"`, `"false"` e `"0012"`. Números e booleanos de JSON/YAML são convertidos em strings. Null, arrays e objetos aninhados precisam de um valor de string explícito. Coloque valores YAML como `0012` entre aspas quando a grafia exata for importante.

O analisador aceita linhas em branco, comentários com `#`, o prefixo `export` e aspas simples, duplas ou invertidas com valores de várias linhas. Apenas as sequências `\n` e `\r` entre aspas duplas são expandidas. As demais aspas e barras invertidas permanecem literais, seguindo o comportamento comum de dotenv. As chaves usam letras, números e sublinhados e não podem começar com um número. A saída escolhe um estilo de aspas que preserva o valor.

### Verificações da configuração

Chaves `.env` duplicadas exibem os números de suas linhas; a última definição é usada. Aspas de fechamento ausentes, texto após as aspas de fechamento e atribuições inválidas exibem erros com links para a linha afetada. Aspas tipográficas geram um aviso. Chaves duplicadas em JSON/YAML são erros.

Comentários, estilo original de aspas e formatação não são preservados. Referências como `${NAME}` e comandos shell permanecem literais e nunca são executados. Diferentes carregadores de `.env` seguem regras diferentes; esta ferramenta segue o subconjunto documentado em vez de interpretar scripts shell.

Consulte a [especificação .env do Node.js](https://nodejs.org/api/environment_variables.html#dotenv) e as [regras de análise de dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
