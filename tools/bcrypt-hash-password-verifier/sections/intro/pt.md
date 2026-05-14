## O que faz

Verifique se uma senha em texto simples corresponde a um hash de senha bcrypt. Isso é útil ao depurar código de login, conferir registros de usuários importados ou confirmar que uma migração de senhas manteve os hashes compatíveis.

## Entrada aceita

Cole um hash bcrypt padrão, como `$2b$10$...`, e digite a senha candidata que você quer testar. O verificador aceita prefixos `$2a$`, `$2b$` e `$2y$` com valores de custo de `04` a `31`.

## Como ler o resultado

Um resultado correspondente significa que o bcrypt aceitou a senha para esse hash, incluindo o salt e o custo incorporados na string do hash. Uma divergência significa que a senha não foi verificada; isso não prova que o hash em si seja inseguro. Erros de hash inválido geralmente indicam que o prefixo, o custo, o comprimento ou os caracteres bcrypt base64 estão malformados.

## Notas de privacidade e segurança

- A verificação é executada localmente no seu navegador.
- Senhas e hashes não são armazenados no armazenamento local.
- bcrypt foi projetado para armazenamento de senhas, não para checksums de arquivos de uso geral.
- Use esta ferramenta para depuração e validação, não como a única auditoria de um sistema de autenticação em produção.
