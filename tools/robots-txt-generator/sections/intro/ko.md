## robots.txt 생성기란?

robots.txt 생성기는 User-agent 규칙, Allow/Disallow 경로, Sitemap 링크를 조합해 robots.txt 파일을 작성하도록 도와줍니다. 사이트 루트에 /robots.txt로 배포해 크롤러가 읽을 수 있게 하세요.

### 이 생성기로 할 수 있는 일

- 검색 엔진, AI 크롤러 또는 사용자 지정 봇별로 규칙을 따로 만들 수 있습니다
- `Allow`, `Disallow`, Sitemap, 선택적 고급 지시어를 한곳에서 추가할 수 있습니다
- 바로 게시할 수 있는 `robots.txt` 파일을 복사하거나 다운로드할 수 있습니다

### 예시

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

이 예시는 크롤러에게 `/admin/` 대부분을 피하도록 요청하고, `/admin/help/` 는 크롤링 가능하게 두며, Sitemap 위치도 알려 줍니다.

### 중요한 참고 사항

- 파일은 사이트 루트의 `/robots.txt` 에 게시하세요
- `robots.txt` 는 공개되며 안내용일 뿐, 접근 제어가 아닙니다
- `Host` 와 `Crawl-delay` 는 모든 크롤러가 지원하지 않습니다
