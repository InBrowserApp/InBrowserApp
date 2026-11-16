## O que faz

Decodifique o cabeçalho HTTP Basic Authorization para extrair nome de usuário e senha do Base64. Útil para depuração e testes de API.

## Entrada aceita

Cole algo como: Basic dXNlcjpwYXNz
Esta ferramenta também aceita uma linha completa `Authorization: Basic ...`.

## Observações

- Base64 apenas codifica as credenciais; não as protege.
- O decodificador divide no primeiro `:` e mantém o restante na senha.
- Tudo é executado localmente no seu navegador.
