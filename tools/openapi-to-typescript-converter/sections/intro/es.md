## ¿Qué es OpenAPI to TypeScript Converter?

OpenAPI to TypeScript Converter transforma un documento OpenAPI 3.x en tipos de TypeScript generados directamente en tu navegador. Es útil cuando quieres una vista previa rápida de tipos, un archivo de declaración descargable o una forma segura de probar opciones de `openapi-typescript` sin enviar tu schema a un servidor.

## Cuándo usarlo

Usa esta herramienta cuando ya tengas un schema OpenAPI en JSON o YAML y quieras modelos tipados de petición y respuesta para apps frontend, prototipos de SDK o revisiones de API. Es especialmente útil para comparar opciones de generación antes de confirmar la salida en tu repositorio.

## Antes de generar

Esta reescritura para navegador admite documentos OpenAPI 3.0 y 3.1 empaquetados. Si tu schema todavía contiene objetivos `$ref` externos, agrúpalos o intégralos primero y luego genera aquí la salida final de TypeScript.
