## What It Does

HTTP Basic Authorization 헤더를 디코딩하여 Base64에서 사용자 이름과 비밀번호를 추출합니다. 디버깅 및 API 테스트에 유용.

## Accepted Input

다음과 같이 붙여넣기: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
