## IPA를 열고 메인 앱의 메타데이터 읽기

iOS `.ipa` 파일을 끌어다 놓거나 **IPA 파일 열기**를 선택하세요. 뷰어는 `Payload/Trail Notes.app/Info.plist`와 같은 경로에서 메인 앱의 속성 목록을 읽습니다. 내 파일을 열기 전에 샘플 IPA로 어떤 항목이 나오는지 살펴보세요. 아카이브 압축 해제와 속성 목록 분석은 브라우저에서 이루어집니다.

## 번들 식별자, 버전, 플랫폼 이해하기

`CFBundleIdentifier`에 저장된 번들 식별자는 앱 번들을 식별합니다. `CFBundleShortVersionString`은 출시 버전이고, `CFBundleVersion`은 빌드를 식별합니다. `MinimumOSVersion`과 `CFBundleSupportedPlatforms`에서 패키지에 기록된 최소 OS 버전과 플랫폼 이름을 확인할 수 있습니다. 표시 이름은 `CFBundleDisplayName` 또는 `CFBundleName`에서 가져옵니다.

## Info.plist 확인하고 내보내기

**Info.plist**를 선택하면 개요에 나오지 않는 키를 포함한 전체 속성 목록을 읽기 쉬운 XML로 볼 수 있습니다. 뷰어는 바이너리 및 XML 형식의 속성 목록을 읽을 수 있습니다. 다른 도구에서 읽기 쉬운 형태를 사용하려면 **XML 복사**를, 원본 파일을 저장하려면 **Info.plist 다운로드**를 선택하세요. 표시된 아카이브 경로에서 메타데이터의 출처인 앱 번들을 확인할 수 있습니다.

[Apple 정보 속성 목록 참조 문서](https://developer.apple.com/documentation/bundleresources/information-property-list)
