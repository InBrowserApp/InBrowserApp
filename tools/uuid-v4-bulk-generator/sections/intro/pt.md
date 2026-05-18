Gere um lote de identificadores UUID v4 diretamente no seu navegador quando precisar de IDs aleatórios para linhas de banco de dados, fixtures de API, chaves de objetos, payloads de teste, modelos de importação ou tarefas operacionais pontuais.

## O que UUID v4 fornece

UUID v4 é um identificador de 128 bits criado principalmente a partir de bytes aleatórios criptograficamente seguros. Os bits de versão e variante são fixados pelo layout RFC 4122, então um UUID v4 tem o formato familiar `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` e ainda oferece um espaço aleatório muito grande.

## Escolha um tamanho de lote prático

O lote padrão fornece IDs suficientes para muitos fluxos de trabalho com fixtures e planilhas sem dificultar a leitura da página. Aumente a quantidade ao preparar uma importação maior ou reduza-a quando precisar apenas de alguns identificadores para um exemplo de requisição ou uma edição manual no banco de dados.

## Copie ou exporte

Revise a lista gerada e copie-a para o seu editor ou baixe um arquivo de texto simples. Todos os valores são gerados localmente, e o lote atual nunca é enviado por esta ferramenta.

## Orientação sobre colisões

O risco de colisão de UUID v4 é extremamente baixo para cargas de trabalho normais de aplicações, mas ele não substitui uma restrição de unicidade no banco de dados. Continue impondo unicidade quando o ID se tornar uma chave primária, token público ou referência durável.
