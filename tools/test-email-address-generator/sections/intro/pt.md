## Gerar um lote de endereços de e-mail de teste

Escolha um domínio, informe a quantidade e selecione **Gerar**. Escolha **Qualquer domínio de exemplo** para misturar domínios em um lote. Cada endereço aparece apenas uma vez por lote. Copie os resultados para um formulário ou uma planilha, ou baixe um arquivo de texto UTF-8 com um endereço por linha para seus dados de teste.

## Quais domínios de e-mail posso usar?

O Faker.js gera endereços em `example.com`, `example.net` e `example.org`. Esses [domínios de exemplo reservados](https://www.iana.org/help/example-domains) são usados em documentação e dados de exemplo. Em `alex.morgan42@example.com`, a parte antes de `@` é a parte local e `example.com` é o domínio. Use um único domínio quando seu teste esperar um valor fixo ou misture domínios para testar filtros e importações.

## O que posso testar com esses endereços?

Use esses exemplos para testar campos de formulários de cadastro, o formato de endereços de e-mail, listas de contas ou a deduplicação em um banco de dados. O gerador produz os endereços em texto sem criar caixas de entrada. Para testar a entrega ou um link de verificação, use uma caixa de entrada que você controla ou o ambiente de testes de e-mail do seu desenvolvimento.
