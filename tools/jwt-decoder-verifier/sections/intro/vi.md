## Bộ giải mã và xác minh JWT là gì?

JSON Web Token là một chuỗi compact gồm ba phân đoạn base64url: header, payload và chữ ký. Công cụ này giải mã header và payload trong trình duyệt của bạn để bạn có thể kiểm tra cấu trúc token mà không cần gửi token lên máy chủ.

Xác minh chữ ký kiểm tra xem token có được ký bằng khóa và thuật toán bạn mong đợi hay không. Dùng shared secret cho token HS256, HS384 hoặc HS512. Dùng khóa công khai PEM, JWK hoặc JWKS cho token RS, PS và ES.

## Khi nào nên dùng

Dùng bộ giải mã khi gỡ lỗi luồng xác thực, kiểm tra claim OAuth hoặc OpenID Connect, so sánh các môi trường, hoặc xác nhận rằng backend đang phát hành đúng các giá trị audience, issuer, subject, expiration và key identifier như mong đợi.

Dùng xác minh khi bạn có secret hoặc khóa công khai tương ứng và cần xác nhận rằng header, payload và chữ ký vẫn thuộc về cùng một token. Công cụ cũng làm nổi bật `exp`, `nbf` và `iat` để các vấn đề phổ biến về đồng hồ và hết hạn hiển thị ngay lập tức.

## Lưu ý bảo mật

Payload của JWT chỉ được mã hóa dạng biểu diễn, không được mã hóa bảo mật. Bất kỳ ai có token đều có thể đọc các claim của nó, trừ khi token là một JWE được mã hóa riêng, loại mà công cụ này không xử lý.

Không dán token production hoặc secret riêng tư trên máy dùng chung. Công cụ chạy cục bộ trong trình duyệt của bạn và không lưu token hoặc vật liệu xác minh, nhưng quy trình an toàn nhất vẫn là dùng token kiểm thử có thời hạn ngắn và khóa công khai bất cứ khi nào có thể.
