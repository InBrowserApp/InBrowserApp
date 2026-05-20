## CSR이란?

인증서 서명 요청(CSR)은 인증 기관(CA)이 TLS 또는 코드 서명 인증서를 발급하는 데 필요한 소규모 PKCS#10 문서입니다. CSR에는 키 쌍의 공개 키, CA가 인증할 신원 정보(Subject), 그리고 DNS 이름이나 IP 주소와 같은 추가 식별자(Subject Alternative Names, SAN)가 포함되며, 대응하는 개인 키로 서명됩니다.

이 도구는 Web Crypto API와 [`@peculiar/x509`](https://github.com/PeculiarVentures/x509)를 사용하여 CSR을 브라우저 안에서 완전히 생성합니다. 키나 요청 정보는 서버로 전송되지 않습니다.

## 이 도구를 사용하는 경우

- 공개 CA(Let's Encrypt, DigiCert, ZeroSSL, Sectigo 등)에서 TLS 인증서를 요청할 때, CA의 워크플로에서 CSR을 직접 붙여넣도록 요구하는 경우.
- ACME 기반, smallstep, EJBCA, AD CS 등 내부 인증 기관을 위한 CSR을 외부 폼을 신뢰하지 않고 생성하고 싶은 경우.
- 기존 PKCS#8 PEM 키를 가져와 동일한 개인 키로 새 CSR에만 서명하여 인증서를 재발급하는 경우.

## 양식 작성 방법

- **키 소스** — *새로 생성*을 선택하면 새 키 쌍이 생성되고, *기존 키 가져오기*를 선택하면 암호화되지 않은 PKCS#8 PEM 키를 붙여넣을 수 있습니다. 암호화된 키, 레거시 `RSA PRIVATE KEY`, `EC PRIVATE KEY` 블록은 허용되지 않으므로 먼저 `openssl pkcs8 -topk8 -nocrypt`로 변환하세요.
- **알고리즘** — RSA는 가장 넓은 호환성을 제공하는 기본값입니다. ECDSA는 더 작은 서명을 생성하며 최신 CA 및 TLS 클라이언트에서 널리 지원됩니다.
- **Subject** — 대부분의 공개 CA는 Common Name을 제외한 나머지 필드를 무시하고 DNS SAN 목록을 권위 있는 정보로 취급합니다. 그러나 사설 CA는 전체 DN을 요구할 수 있습니다.
- **SAN 항목** — 인증서에 포함할 호스트 이름, IP 주소, 이메일 주소, URI를 나열합니다. 한 줄에 하나씩 또는 쉼표로 구분하여 입력합니다.

## 주의 사항

- CSR과 함께 표시되는 개인 키는 로컬에서 생성되며 브라우저 밖으로 전송되지 않습니다. 탭을 닫기 전에 반드시 저장하세요 — 대응하는 개인 키 없이는 서명된 인증서를 사용할 수 없습니다.
- 공개 CA는 Common Name(또는 최소 하나의 SAN 항목)이 검증 가능한 DNS 이름이어야 합니다. IP 주소 SAN은 내부 인증서에 주로 유용합니다.
- 생성된 개인 키는 암호화되어 있지 않습니다. 저장 전에 암호문이 필요하다면 `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem`으로 암호화하세요.
- RSA (2048/3072/4096) 및 ECDSA (P-256/P-384/P-521)만 지원됩니다. EdDSA는 브라우저 및 CA 전반에 걸친 지원이 아직 일관적이지 않아 의도적으로 제외되었습니다.
