## CAR 보관 파일이나 파일의 Piece CID 계산하기

Filecoin 스토리지 제공자에게 보낼 파일을 그대로 선택하세요. **Piece CID 계산**을 누른 다음 작업에 필요한 식별자를 복사하세요. 이 도구는 패딩된 피스 크기도 바이트 단위로 표시합니다. 브라우저는 기기에서 파일을 읽고 나누어 처리하므로 파일 내용은 기기에 그대로 남습니다.

## 어떤 형식을 사용해야 하나요?

**Piece CID(v2)**는 [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md)를 따릅니다. 일반적으로 `bafkzci`로 시작하며 최신 Filecoin 도구에 필요한 페이로드 크기 정보가 들어 있습니다. **이전 형식의 CommP(v1)**는 일반적으로 `baga6ea4`로 시작하며 기존 Filecoin 스토리지 거래에 사용됩니다. 작업에 이전 형식의 Piece CID와 패딩된 피스 크기가 필요하다면 해당 커밋먼트를 복사하고 옆에 표시된 크기를 사용하세요. 어느 형식이든 비교란에 붙여넣어 기존 커밋먼트가 파일과 일치하는지 확인할 수 있습니다. 파일 끝에 붙은 값이 0인 바이트의 개수만 다른 경우, 이전 형식의 CommP가 같을 수 있습니다.

## IPFS CID와 왜 다른가요?

IPFS 루트 CID는 블록이나 파일 또는 디렉터리의 루트를 식별합니다. Filecoin Piece CID는 스토리지 페이로드의 정확한 바이트에 Filecoin의 패딩 및 해싱 규칙을 적용해 얻습니다. 페이로드가 CAR 보관 파일이면 보관 파일 자체에서 커밋먼트를 계산하세요. 두 CAR의 IPFS 루트 CID가 같아도 블록의 저장 순서가 다르면 Piece CID가 달라질 수 있습니다. 스토리지 거래를 제출할 때는 계산에 사용했던 것과 같은 파일을 사용하세요.

형식과 패딩 규칙은 [Filecoin Piece 사양](https://spec.filecoin.io/systems/filecoin_files/piece/)을 참고하세요.
