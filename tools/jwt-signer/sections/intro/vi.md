## JWT signer là gì?

JWT signer tạo một JSON Web Token compact bằng cách tuần tự hóa header và payload, rồi ký chúng bằng secret hoặc khóa riêng. Kết quả là token ba phần `header.payload.signature` được nhiều hệ thống API, OAuth, và session sử dụng.

## Khi nào nên dùng công cụ này

- Tạo token kiểm thử cục bộ cho phát triển API, môi trường staging, và demo.
- So sánh cách các thuật toán khác nhau làm thay đổi header và signature của token.
- Thêm các claims như `sub`, `iss`, `aud`, `exp`, `iat`, `scope`, hoặc các trường ứng dụng tùy chỉnh mà không cần viết một script dùng tạm.
- Tạo token bằng HMAC shared secrets hoặc bằng khóa riêng RSA/ECDSA ở dạng PKCS#8 PEM hoặc JWK.

## Cần kiểm tra gì trước khi dùng token đã ký

- Khớp thuật toán với loại khóa: `HS*` dùng shared secret, `RS*` và `PS*` dùng khóa riêng RSA, còn `ES*` dùng khóa riêng EC.
- Thêm claims về thời hạn và audience khi dịch vụ nhận yêu cầu.
- Không để khóa riêng production trong trình duyệt và máy dùng chung. Công cụ này chạy cục bộ, nhưng không thể bảo vệ khóa khỏi một thiết bị đã bị xâm phạm.
- Hãy nhớ rằng ký không phải là mã hóa. Bất kỳ ai nhận được token đều có thể giải mã header và payload.
