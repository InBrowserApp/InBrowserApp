## JSON Schema란 무엇인가요?

JSON Schema는 JSON 데이터 구조를 설명하는 표준입니다. 필드 타입, 중첩 구조, 필수 키, 그리고 검증에 유용한 제약 조건을 기계가 읽을 수 있는 형태로 표현할 수 있습니다.

### 이 생성기가 하는 일

예시 JSON을 붙여 넣으면 도구가 객체, 배열, 숫자, 불리언, null, 그리고 일반적인 문자열 형식에 대한 초기 schema를 추론합니다. 결과는 복사, 다운로드, 수동 수정이 가능합니다.

### 예시

예를 들어 다음과 같은 샘플 데이터가 있을 때:

**예시 입력**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**생성된 schema**

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

### 활용 팁

- 특히 배열 안에는 대표성이 있는 샘플 데이터를 넣어야 선택 필드를 더 잘 추론할 수 있습니다.
- 입력이 부분적인 예시라면 “Infer required properties”를 끄세요.
- 기본적으로 더 엄격한 schema가 필요하다면 “Allow additional properties”를 끄세요.
- email, URI, UUID, date-time 추론을 위해 문자열 형식 감지는 켜 두는 것이 좋습니다.
