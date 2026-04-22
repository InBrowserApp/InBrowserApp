## JWK ↔ PEM 변환이란?

JWK(JSON Web Key)은 JOSE/JWT 시스템에서 사용하는 JSON 기반 키 형식입니다. RSA, EC, OKP 키를 표현할 수 있으며 JWK Set(JWKS)로 묶일 수도 있습니다.

PEM은 Base64로 인코딩된 ASN.1/DER 키로, BEGIN PUBLIC KEY 또는 BEGIN PRIVATE KEY 같은 헤더를 가지며 TLS, OpenSSL, 다양한 SDK에서 흔히 사용됩니다.

이 도구는 키를 양방향으로 변환하며, 공개키(SPKI) 또는 개인키(PKCS8)를 선택해도 키 소재를 보존합니다. RSA, EC(P-256/384/521), OKP(Ed25519/X25519/Ed448/X448)를 지원하고 모든 처리는 브라우저에서 로컬로 이뤄집니다.

라이브러리, 게이트웨이, CLI가 OpenSSL 스타일 키 파일을 요구할 때는 JWK → PEM을 선택하세요. 키를 JWKS에 넣거나 JSON 기반 설정으로 전달하거나 브라우저 또는 serverless 환경에서 써야 할 때는 PEM → JWK를 선택하세요. 개인 키 변환은 개인 키 재료를 그대로 유지하므로, 상대가 공개 키만 필요하다면 공개 출력만 공유하세요.

- PEM만 받는 시스템에서 JWK/JWKS 키를 사용할 수 있습니다.
- JWT 라이브러리, API 게이트웨이 또는 키 배포용으로 PEM 키를 내보낼 수 있습니다.
- 개인키 데이터를 노출하지 않고 공개키를 안전하게 공유할 수 있습니다.
