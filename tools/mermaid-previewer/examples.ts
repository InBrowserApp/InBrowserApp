export const examples = {
  flowchart: `flowchart LR
  A([New request]) --> B{Approved?}
  B -- Yes --> C[Schedule work]
  B -- No --> D[Request changes]`,
  sequence: `sequenceDiagram
  actor Customer
  participant Shop
  participant Warehouse
  Customer->>Shop: Place order
  Shop->>Warehouse: Reserve items
  Warehouse-->>Shop: Items reserved
  Shop-->>Customer: Confirm order`,
  relationships: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT ||--o{ LINE_ITEM : appears_in`,
}
