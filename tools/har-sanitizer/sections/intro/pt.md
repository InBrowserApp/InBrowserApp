## Como limpar um arquivo HAR

Um arquivo HAR (HTTP Archive) registra as requisições e respostas de rede do navegador. Ele pode incluir cookies de sessão, tokens de autorização, URLs e conteúdo com dados privados. Crie uma cópia limpa para enviar ao suporte, anexar a um relato de erro ou compartilhar com a equipe. A cópia mantém o método, o código de status e os tempos de cada requisição.

1. Abra as ferramentas do desenvolvedor do navegador e acesse o painel **Rede**. Reproduza o problema e exporte o registro como um arquivo HAR. No Chrome, escolha **Exportar HAR (limpo)** para baixar uma cópia da qual os cabeçalhos padrão de credenciais já foram removidos.
2. Abra ou solte o HAR exportado aqui. A ferramenta prepara uma cópia assim que você seleciona o arquivo. Experimente a captura de exemplo para ver o que muda.
3. Confira as contagens e escolha **Baixar HAR limpo**. O nome do novo arquivo termina em `.sanitized.har`. Você pode importá-lo nas ferramentas do desenvolvedor ou no [Analisador de rede HAR](/pt/tools/har-analyzer/). O processamento ocorre no seu navegador.

## Quais dados são removidos ou ocultados?

A ferramenta remove cookies e cabeçalhos de autenticação comuns, como `Authorization` e `X-API-Key`. Por padrão, ela oculta os valores dos parâmetros de URL e remove os corpos de requisição e resposta, além dos dados registrados de WebSocket. Por exemplo, `?token=example&page=2` vira `?token=REDACTED&page=REDACTED` no arquivo exportado. Os nomes dos parâmetros continuam disponíveis para depuração. A contagem inclui cada campo alterado, mesmo quando o mesmo valor aparece em vários campos.

Desative a opção correspondente se precisar dos valores ou do conteúdo original para reproduzir o problema. Nomes de host, caminhos de URL, outros cabeçalhos e metadados específicos do navegador ainda podem conter informações privadas. Confira esses campos antes de compartilhar o arquivo.
