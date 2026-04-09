## O que é o Conversor de OpenAPI para TypeScript?

O Conversor de OpenAPI para TypeScript transforma um documento OpenAPI 3.x em tipos TypeScript gerados diretamente no navegador. Ele é útil quando você quer uma prévia rápida dos tipos, um arquivo de declaração para baixar ou uma forma segura de testar opções do `openapi-typescript` sem enviar seu schema para um servidor.

## Quando Usar

Use esta ferramenta quando você já tiver um schema OpenAPI em JSON ou YAML e quiser modelos tipados de requisição e resposta para apps frontend, protótipos de SDK ou revisão de APIs. Ela é especialmente útil para comparar opções de geração antes de salvar o resultado no repositório.

## Antes De Gerar

Esta versão no navegador suporta documentos OpenAPI 3.0 e 3.1 já agrupados. Se o seu schema ainda tiver targets externos de `$ref`, faça bundle ou inline deles primeiro e então gere aqui a saída final em TypeScript.
