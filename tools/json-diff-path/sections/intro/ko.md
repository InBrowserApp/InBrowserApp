## 개요

JSON Diff Path는 두 JSON 문서를 비교해 모든 구조 변경을 JSONPath와 JSON Pointer 출력을 함께 제공하는 읽기 쉬운 경로 기록으로 바꿉니다.

## 사용할 때

API 페이로드 변경을 검토하거나, 설정 마이그레이션을 확인하거나, 자동화를 위한 RFC 6902 JSON Patch 작업을 생성해야 할 때 사용하세요.

## 동작 방식

이 도구는 두 JSON 입력을 파싱하고 `add`, `remove`, `replace` 변경을 계산한 뒤, 해당 작업을 필터링하고 같은 결과 패널에서 경로 목록과 JSON Patch 출력 사이를 전환할 수 있게 합니다.
