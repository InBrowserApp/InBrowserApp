import { describe, expect, it } from "vitest"

import { validateKubernetes } from "./validate-kubernetes"

const config = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  creationTimestamp: null
data:
  enabled: "true"
`

describe("Kubernetes manifests", () => {
  it("checks multi-document YAML and resolves core and grouped schemas", () => {
    expect(
      validateKubernetes(`${config}
---
# ignored document
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: null
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:alpine
          resources:
            limits:
              cpu: 0.5
`)
    ).toEqual([])
    expect(validateKubernetes(config)).toEqual([])
  })

  it("checks duplicate keys and keeps validating other documents", () => {
    const issues = validateKubernetes(`${config}  enabled: "false"
---
apiVersion: v1
kind: ConfigMap
data:
  enabled: true
`)
    expect(issues).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("unique"),
        location: expect.objectContaining({ line: 8 }),
      }),
      expect.objectContaining({
        message: expect.stringContaining("string"),
        path: "data.enabled",
        location: expect.objectContaining({ line: 13 }),
      }),
    ])
  })

  it("reports unknown fields, required properties and sequence entries", () => {
    const issues = validateKubernetes(`apiVersion: v1
kind: Service
spec:
  ports:
    - targetPort: http
      typo: true
    - false
`)
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "spec.ports.0.port",
          message: expect.stringContaining("required"),
        }),
        expect.objectContaining({
          code: "unknownField",
          path: "spec.ports.0.typo",
          location: expect.objectContaining({ line: 6 }),
        }),
        expect.objectContaining({
          path: "spec.ports.1",
          message: expect.stringContaining("object"),
          location: expect.objectContaining({ line: 7 }),
        }),
      ])
    )
  })

  it("reports a custom schema separately and checks List entries", () => {
    expect(
      validateKubernetes(`apiVersion: v1
kind: List
items:
  - apiVersion: example.com/v1
    kind: Widget
  - apiVersion: v1
    kind: ConfigMap
    data:
      invalid~/: true
  - false
`)
    ).toEqual([
      expect.objectContaining({ code: "unknownSchema", path: "items.0.kind" }),
      expect.objectContaining({
        path: "items.1.data.invalid~/",
        message: expect.stringContaining("string"),
      }),
      expect.objectContaining({ code: "expectedResource", path: "items.2" }),
    ])
  })

  it("distinguishes missing identity, wrong roots and missing List items", () => {
    expect(
      validateKubernetes(`kind: ""
apiVersion: false
---
- Deployment
---
apiVersion: v1
kind: List
`)
    ).toEqual([
      expect.objectContaining({ code: "missingIdentity", path: "apiVersion" }),
      expect.objectContaining({ code: "missingIdentity", path: "kind" }),
      expect.objectContaining({ code: "expectedResource" }),
      expect.objectContaining({
        message: expect.stringContaining("required"),
        path: "items",
      }),
    ])
  })

  it("ignores empty documents but rejects a YAML null resource", () => {
    for (const input of ["# only a comment", "---\n# only a comment", "---"]) {
      expect(validateKubernetes(input)).toEqual([
        expect.objectContaining({ code: "emptyDocument" }),
      ])
    }
    expect(validateKubernetes("null")).toEqual([
      expect.objectContaining({ code: "expectedResource" }),
    ])
  })

  it("reports unresolved aliases and unknown YAML tags", () => {
    expect(
      validateKubernetes("apiVersion: v1\nkind: ConfigMap\ndata: *missing")
    ).toEqual([
      expect.objectContaining({ message: expect.stringContaining("alias") }),
    ])
    expect(validateKubernetes("apiVersion: v1\nkind: !test ConfigMap")).toEqual(
      [expect.objectContaining({ message: expect.stringContaining("!test") })]
    )
  })
})

it("matches Kubernetes boolean and unquoted timestamp decoding", () => {
  expect(
    validateKubernetes(`apiVersion: v1
kind: Pod
metadata:
  annotations:
    release: 2026-11-24
spec:
  hostNetwork: yes
  containers:
    - name: web
      image: nginx
`)
  ).toEqual([])
  expect(
    validateKubernetes(`apiVersion: v1
kind: ConfigMap
data:
  enabled: on
`)
  ).toEqual([
    expect.objectContaining({
      message: "must be string",
      path: "data.enabled",
    }),
  ])
})

it("reports List fields and handles cyclic YAML aliases", () => {
  expect(
    validateKubernetes(`&self
apiVersion: v1
kind: List
metadata: false
tyop: value
items:
  - *self
---
${config}
`)
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ code: "unknownField", path: "tyop" }),
      expect.objectContaining({
        message: expect.stringContaining("Circular"),
        path: "items.0",
      }),
    ])
  )
})

it("filters optional-null alternatives from a bad metadata diagnostic", () => {
  expect(
    validateKubernetes("apiVersion: v1\nkind: ConfigMap\nmetadata: false")
  ).toEqual([
    expect.objectContaining({ path: "metadata", message: "must be object" }),
  ])
})
