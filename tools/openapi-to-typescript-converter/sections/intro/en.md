## What Is OpenAPI To TypeScript Converter?

OpenAPI to TypeScript Converter turns an OpenAPI 3.x document into generated TypeScript types directly in your browser. It is useful when you want a fast type preview, a downloadable declaration file, or a safe way to test `openapi-typescript` options without sending your schema to a server.

## When To Use It

Use this tool when you already have an OpenAPI schema in JSON or YAML and want typed request and response models for frontend apps, SDK prototypes, or API reviews. It is especially helpful for comparing generation options before you commit the output to your repository.

## Before You Generate

This browser rewrite supports bundled OpenAPI 3.0 and 3.1 documents. If your schema still contains external `$ref` targets, bundle or inline them first, then generate the final TypeScript output here.
