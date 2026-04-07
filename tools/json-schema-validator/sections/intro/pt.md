## O que é a validação de JSON Schema?

Use esta ferramenta quando quiser feedback rápido ao projetar payloads, depurar exemplos de API ou verificar se uma alteração no esquema quebra dados de amostra. Tudo é executado localmente no navegador, então o JSON bruto nunca sai da página.

## Onde se encaixa bem

- Revisar payloads de exemplo na documentação de API.
- Validar dados simulados durante o trabalho de frontend.
- Verificar campos sensíveis ao formato, como `uuid`, `email` ou `date-time`.

## O que ela não substitui

- Autorização do lado do servidor e regras de negócio.
- Verificações de contrato que dependem de referências remotas ou estado da aplicação.
- Validação completa em CI de todo o seu conjunto de esquemas.
