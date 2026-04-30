## Local Font Access란?

Local Font Access는 기기에 설치된 폰트를 나열하는 브라우저 API입니다.

이 도구로 결과를 검색하고, 관련 서체를 비교하고, 선택한 폰트의 CSS 스니펫을 복사할 수 있습니다.

보안 컨텍스트와 지원 브라우저에서만 동작하며 사용자 권한(local-fonts)이 필요합니다.

API는 family, fullName, postscriptName, style 정보를 가진 FontData를 반환합니다.

### 핵심 사항

- 현재 기기에서 CSS `font-family` 스택에 필요한 정확한 이름을 확인하는 데 활용하세요.
- 호출은 사용자 제스처로 트리거되어야 합니다.
- Permissions Policy가 접근을 차단할 수 있습니다.
- 이 도구는 로컬에서 실행되며 폰트를 업로드하지 않습니다.
