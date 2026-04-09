## OpenAPI to TypeScript Converter란?

OpenAPI to TypeScript Converter는 OpenAPI 3.x 문서를 브라우저에서 바로 생성된 TypeScript 타입으로 바꿉니다. 빠른 타입 미리보기, 내려받을 수 있는 선언 파일, 또는 스키마를 서버로 보내지 않고 `openapi-typescript` 옵션을 안전하게 시험해 보고 싶을 때 유용합니다.

## 언제 사용하나요?

이미 JSON 또는 YAML 형식의 OpenAPI 스키마가 있고, 프런트엔드 앱, SDK 프로토타입, 또는 API 검토를 위한 타입이 지정된 요청 및 응답 모델이 필요할 때 이 도구를 사용하세요. 출력 결과를 저장소에 반영하기 전에 생성 옵션을 비교할 때 특히 도움이 됩니다.

## 생성하기 전에

이 브라우저 버전은 번들링된 OpenAPI 3.0 및 3.1 문서를 지원합니다. 스키마에 아직 외부 `$ref` 대상이 남아 있다면, 먼저 번들링하거나 인라인으로 포함한 뒤 여기서 최종 TypeScript 출력을 생성하세요.
