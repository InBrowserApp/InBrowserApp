## 거래 ID로 Filecoin 스토리지 거래 조회하기

Filecoin 메인넷 Storage Market의 **거래 ID**를 숫자로 입력하고 **거래 조회**를 누르세요. **예제 사용하기**를 누르면 실제 공개 기록에서 상태, 스토리지 제공자, 클라이언트, 날짜 및 Piece CID를 확인할 수 있습니다. 여기서 조회하는 대상은 Storage Market 거래입니다. Filecoin Onchain Cloud는 별도의 데이터 세트 ID를 사용합니다.

## Filecoin 거래 상태 읽기

활성 상태는 활성화가 기록되었고 종료 예정 시점이 아직 지나지 않았음을 뜻합니다. 활성화 대기는 시작 예정 시점 전으로, 아직 활성화를 기다리는 상태입니다. 시작 예정 시점이 지났지만 활성화되지 않은 경우, 만료된 경우, 마켓 상태에 슬래싱이 기록된 경우도 표시됩니다. 시작 및 종료 에포크는 거래 제안에서 가져옵니다. 체인의 에포크 일정을 기준으로 UTC 날짜를 계산합니다.

## 거래의 Piece CID를 내 파일과 비교하기

Piece CID는 Filecoin 피스에 대해 기록된 커밋먼트입니다. 이 값을 복사하고 Filecoin Piece CID 계산기에서 로컬 파일이나 CAR로 계산한 커밋먼트와 비교할 수 있습니다. 결과에는 Filecoin 피스 패딩을 적용한 크기도 표시됩니다. 검증된 거래에는 Filecoin Plus 검증 플래그가 있습니다.

## 이전 Filecoin 거래 찾기

브라우저는 먼저 Filecoin 메인넷의 현재 마켓 상태를 조회합니다. 거래가 현재 마켓 상태에서 제외된 경우 Filfox에 색인된 최초 거래 조건을 가져올 수 있으면 과거 기록으로 표시합니다. 여기에는 예정 날짜와 거래 당사자가 포함됩니다. **Filfox에서 보기**를 누르면 같은 거래 ID의 탐색기 페이지가 열립니다.

체인이 반환하는 필드는 [Filecoin Storage Market RPC 참조](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal)를 참고하세요.
