## O que é JSON Schema?

JSON Schema é um padrão para descrever a estrutura de dados JSON. Ele permite expressar tipos de campos, estruturas aninhadas, chaves obrigatórias e restrições úteis para validação.

### O que este gerador faz

Cole um JSON de exemplo e a ferramenta infere um schema inicial para objetos, arrays, números, booleanos, valores null e formatos de string comuns. O resultado pode ser copiado, baixado e refinado.

### Exemplo

Por exemplo, com esta carga de exemplo:

**Entrada de exemplo**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema gerado**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Dicas

- Use dados de exemplo representativos, especialmente dentro de arrays, para identificar melhor os campos opcionais.
- Desative “Infer required properties” se a entrada for apenas um exemplo parcial.
- Desative “Allow additional properties” se quiser um schema mais rígido por padrão.
- Mantenha a detecção de formatos ativada para inferir email, URI, UUID e date-time.
