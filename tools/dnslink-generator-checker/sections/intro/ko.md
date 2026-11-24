## IPFS용 DNSLink TXT 레코드 생성하기

DNSLink는 도메인이나 하위 도메인을 콘텐츠 경로에 연결합니다. 도메인을 입력한 다음 IPFS CID, IPFS 경로 또는 IPNS 경로를 붙여넣으세요. DNS 제공업체에서 TXT 레코드를 추가하고 생성된 **이름**과 **TXT 값**을 입력하세요. 예를 들어 `www.example.com`의 레코드 이름은 `_dnslink.www.example.com`입니다. DNS 편집 화면에서 `example.com`을 자동으로 붙인다면 이름 필드에 `_dnslink.www`를 입력하세요.

## DNSLink가 가리키는 대상 확인하기

**게시된 레코드 확인**을 누르면 Cloudflare와 Google이 반환한 TXT 레코드를 볼 수 있습니다. 현재 설정만 조회하려면 대상 필드를 비워 두세요. 원하는 대상을 입력하면 게시된 값과 비교할 수 있습니다. 레코드를 변경한 뒤에도 캐시가 만료될 때까지 DNS 확인자가 이전 값을 반환할 수 있습니다. 표시된 TTL은 반환된 DNS 응답을 캐시에 보관할 수 있는 남은 시간입니다.

## 사용자 지정 도메인에서 IPFS 웹사이트 업데이트하기

IPFS CID를 사용하면 특정 버전의 파일을 직접 가리킬 수 있습니다. IPNS 경로를 사용하면 업데이트할 수 있는 이름을 가리킬 수 있습니다. DNSLink는 이를 지원하는 클라이언트와 게이트웨이에 불러올 콘텐츠를 알려 줍니다. 자신의 HTTPS 도메인에서 해당 콘텐츠를 제공하려면 DNSLink를 지원하는 게이트웨이를 설정하고 도메인을 그 게이트웨이에 연결하세요. [IPFS 사용자 지정 도메인과 DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
