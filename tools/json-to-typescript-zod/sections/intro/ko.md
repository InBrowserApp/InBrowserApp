## 필드를 추론하는 방법

변환기는 배열의 모든 항목을 살펴봅니다. 이 예시에서는 첫 번째 레코드에만 `active`가 있으므로 선택적 필드가 됩니다. 두 레코드 모두 `name`이 있고, 하나의 값은 문자열이며 다른 하나는 `null`입니다. 따라서 `name`은 필수 필드이고 타입은 `string | null`입니다.

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

예시 배열이 비어 있으면 요소 타입은 `unknown`이 됩니다. API가 반환할 수 있는 다양한 구조의 레코드를 예시에 포함하면 실제 응답에 더 가까운 타입을 얻을 수 있습니다.

## TypeScript와 Zod의 사용 시점

편집기와 컴파일 단계에서 타입을 확인하려면 **TypeScript**를 사용하세요. 실행 중에 받은 데이터를 검증하려면 **Zod** 스키마에서 `apiResponseSchema.safeParse(data)`를 호출하세요. 생성된 Zod 파일은 TypeScript 타입도 내보냅니다. API에서 허용 값이나 문자열 형식을 정해 두었다면 생성된 코드에 해당 규칙을 추가하세요.
