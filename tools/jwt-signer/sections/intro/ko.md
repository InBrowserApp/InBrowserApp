## JWT signer란 무엇인가요?

JWT signer는 header와 payload를 직렬화한 다음 비밀값 또는 개인 키로 서명하여 compact JSON Web Token을 만듭니다. 결과는 많은 API, OAuth, 세션 시스템에서 사용하는 세 부분으로 된 `header.payload.signature` 토큰입니다.

## 이 도구를 사용할 때

- API 개발, 스테이징 환경, 데모를 위한 로컬 테스트 토큰을 만듭니다.
- 서로 다른 알고리즘이 토큰 header와 signature를 어떻게 바꾸는지 비교합니다.
- 일회용 스크립트를 작성하지 않고 `sub`, `iss`, `aud`, `exp`, `iat`, `scope` 또는 사용자 지정 애플리케이션 필드 같은 claims를 추가합니다.
- HMAC 공유 비밀값 또는 PKCS#8 PEM이나 JWK 형식의 RSA/ECDSA 개인 키로 토큰을 생성합니다.

## 서명된 토큰을 사용하기 전에 확인할 사항

- 알고리즘을 키 유형과 일치시키세요. `HS*`는 공유 비밀값을 사용하고, `RS*`와 `PS*`는 RSA 개인 키를 사용하며, `ES*`는 EC 개인 키를 사용합니다.
- 수신 서비스가 요구하는 경우 만료 및 audience claims를 추가하세요.
- 프로덕션 개인 키를 공유 브라우저와 컴퓨터에 두지 마세요. 이 도구는 로컬에서 실행되지만, 이미 손상된 기기에서 키를 보호할 수는 없습니다.
- 서명은 암호화가 아니라는 점을 기억하세요. 토큰을 받는 사람은 누구나 header와 payload를 디코딩할 수 있습니다.
