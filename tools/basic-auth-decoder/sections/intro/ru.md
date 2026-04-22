## What It Does

Декодируйте заголовок HTTP Basic Authorization, чтобы извлечь имя пользователя и пароль из Base64. Полезно для отладки и тестирования API.

## Accepted Input

Вставьте что-то вроде: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
