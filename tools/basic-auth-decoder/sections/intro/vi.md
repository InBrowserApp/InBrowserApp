## What It Does

Giải mã tiêu đề HTTP Basic Authorization để trích xuất tên người dùng và mật khẩu từ Base64. Hữu ích cho gỡ lỗi và kiểm thử API.

## Accepted Input

Dán thứ gì đó như: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
