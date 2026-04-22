## Basic Auth란?

Basic Auth는 `username:password` 를 Base64로 인코딩한 뒤 `Authorization` 헤더에 넣는 방식입니다. 단순하고 널리 지원되지만, Base64는 암호화가 아니라 인코딩일 뿐입니다.

## 이 도구가 생성하는 것

- API 클라이언트에 바로 붙여 넣을 수 있는 `Authorization: Basic ...` 헤더.
- 빠른 테스트용으로 바로 실행할 수 있는 `curl` 예제.
- 모든 처리가 브라우저 안에서 로컬로 실행됩니다.

## 사용 시 주의할 점

- Basic Auth 자격 증명을 보낼 때는 항상 HTTPS를 사용하세요.
- 이 헤더를 본 사람은 원래 사용자 이름과 비밀번호를 다시 디코딩할 수 있습니다.
- Basic Auth는 내부 도구, 스테이징 환경, 빠른 API 확인에 적합합니다.
