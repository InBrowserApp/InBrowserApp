## O que é validação de e-mail?

A validação de e-mail verifica se um endereço segue regras sintáticas comuns para a parte local, o símbolo `@`, os rótulos do domínio e o domínio de topo. Ela é útil para testar formulários, limpar dados de exemplo e encontrar erros de digitação óbvios antes do envio.

### O que este validador verifica

- Um único `@` separando a parte local e o domínio
- Limites de comprimento para o endereço completo, a parte local e o domínio
- Caracteres permitidos, posição dos pontos, regras de hífen e estrutura do TLD
- Um resultado normalizado com o domínio em minúsculas para facilitar a comparação

### Exemplos

- Válido: `name@example.com`
- Válido: `first.last+news@example.co.uk`
- Inválido: `name..dots@example.com`
- Inválido: `user@-example.com`

Domínios internacionalizados devem ser informados em formato Punycode ASCII, por exemplo `user@xn--bcher-kva.example`.

### O que esta ferramenta não verifica

- Se a caixa postal existe ou pode receber mensagens
- Verificações de DNS, MX, SMTP ou de provedores descartáveis
- Se um site aceitará o endereço segundo suas próprias regras de negócio
