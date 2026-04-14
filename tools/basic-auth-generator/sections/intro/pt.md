## O que é Basic Auth?

Basic Auth coloca `username:password` no cabeçalho `Authorization` após codificação em Base64. É simples e amplamente compatível, mas Base64 é apenas codificação, não criptografia.

## O que esta ferramenta gera

- Um cabeçalho `Authorization: Basic ...` para colar em clientes de API.
- Um exemplo de `curl` pronto para testes rápidos.
- Tudo roda localmente no navegador.

## O que você deve lembrar

- Use HTTPS sempre que enviar credenciais Basic Auth.
- Qualquer pessoa que veja o cabeçalho pode decodificar o nome de usuário e a senha originais.
- Basic Auth é útil para ferramentas internas, ambientes de staging e verificações rápidas de API.
