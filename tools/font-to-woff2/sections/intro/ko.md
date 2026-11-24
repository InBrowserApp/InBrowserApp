## TTF 또는 OTF를 WOFF2로 변환하는 방법

TrueType(`.ttf`) 또는 OpenType(`.otf`) 글꼴 파일을 선택하거나 변환 영역에 끌어 놓으세요. 여러 파일을 한꺼번에 추가할 수 있으며, 파일을 추가하면 바로 변환이 시작됩니다. 변환이 끝나면 원본과 WOFF2 파일 크기를 비교하고 **WOFF2 다운로드**를 선택하세요. 예를 들어 `Inter-Regular.ttf`는 `Inter-Regular.woff2`로 변환됩니다. 모든 처리가 브라우저에서 이루어지므로 글꼴 파일은 이 기기에 그대로 남습니다.

## 웹폰트에 WOFF2를 쓰는 이유

WOFF2(Web Open Font Format 2)는 Brotli로 글꼴 데이터를 압축하는 형식입니다. 원본 TTF나 OTF를 제공할 때보다 대개 전송하는 데이터가 적지만, 줄어드는 용량은 글꼴마다 다릅니다. 형식을 바꿔도 모든 글리프와 가변 글꼴 축을 유지하므로, 파일 하나로 여러 굵기를 표현할 수 있습니다. 사이트에서 일부 문자만 사용한다면 [글꼴 서브셋 생성기](../font-subset-generator/)로 파일 크기를 더 줄일 수 있습니다.

## CSS에서 WOFF2 파일을 사용하는 방법

다운로드한 파일을 사이트의 글꼴 폴더에 넣고 `@font-face`로 불러오세요. 경로와 굵기, 스타일은 실제 파일에 맞게 지정합니다. 다음 예에서는 `/fonts/`에서 기본 굵기의 글꼴을 불러오고, 로딩 중에는 대체 글꼴로 텍스트를 표시합니다.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

가변 글꼴이라면 `font-weight: 100 900;`처럼 해당 글꼴이 실제로 지원하는 굵기 범위를 지정하세요. 웹사이트에서 제공하기 전에 글꼴의 라이선스를 확인하고 페이지에서 사용할 언어와 굵기가 제대로 표시되는지 테스트하세요. 자세한 내용은 [MDN의 @font-face 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face)를 참고하세요.
