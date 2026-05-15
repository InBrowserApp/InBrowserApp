## O que é a verificação Argon2?

A verificação Argon2 confere se uma senha em texto simples produz o mesmo hash Argon2 codificado que foi armazenado anteriormente. O hash codificado contém a variante Argon2, os parâmetros de custo, o salt e o digest, para que um verificador possa repetir o mesmo trabalho sem precisar de configurações separadas.

## Quando usar esta ferramenta

- Confirme se uma senha copiada e um hash Argon2 armazenado pertencem um ao outro
- Depure problemas de login ou migração ao mover registros de senha entre sistemas
- Inspecione a variante e os parâmetros de custo dentro de um hash Argon2 codificado
- Teste hashes que usam um segredo opcional do lado do servidor, muitas vezes chamado de pepper

## Como verificar com segurança

1. Cole a senha que deseja verificar.
2. Cole o hash codificado completo, como uma string que começa com `$argon2id$`.
3. Informe o segredo somente se o hash original foi criado com um.
4. Execute a verificação e leia o resultado de correspondência, divergência ou hash inválido.

## Notas de segurança

A verificação acontece localmente no seu navegador, mas senhas e hashes colados ainda podem permanecer na memória do navegador até você redefinir o formulário ou fechar a aba. Evite usar credenciais de produção em dispositivos compartilhados. Para novos sistemas de armazenamento de senhas, Argon2id geralmente é a variante Argon2 preferida porque equilibra resistência a canais laterais e GPUs.
