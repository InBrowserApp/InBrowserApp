# Kubernetes built-in schemas

The bundled schemas use [Kubernetes v1.37.2 OpenAPI definitions](https://github.com/kubernetes/kubernetes/blob/v1.37.2/api/openapi-spec/swagger.json) under the accompanying Apache 2.0 license.

The bundle maps group, version, and kind to the corresponding OpenAPI definition. It retains the types, required fields, items, properties, map values, and references used for structural checks. Named objects reject unknown fields, while maps and unstructured fields retain their open shape. The Kubernetes IntOrString type accepts both integers and strings.
Quantity also accepts numeric YAML values, and optional properties allow null to match Kubernetes decoding.

After changing the pinned release in `schema-version.ts`, run `pnpm --filter @tool/kubernetes-yaml-validator refresh-schema` and format the generated JSON.
