Bộ sưu tập công cụ hash tập hợp các tiện ích hash đã được chuyển đổi để bạn có thể chọn đúng thuật toán trước khi mở một công cụ cụ thể. Bộ này bao gồm digest tệp hằng ngày, kiểm tra tương thích với hệ thống cũ, xác thực thông điệp có khóa, chuỗi Subresource Integrity, hash mật khẩu, xác minh mật khẩu và checksum nhanh không dùng cho mật mã.

## Khi nào nên dùng các công cụ này

Dùng các công cụ digest mật mã khi bạn cần một dấu vân tay có thể lặp lại cho văn bản hoặc tệp, chẳng hạn như so sánh một kho lưu trữ đã tải xuống với checksum SHA-256 đã công bố. Dùng HMAC khi kết quả phải chứng minh rằng người có bí mật dùng chung đã tạo hoặc phê duyệt thông điệp. Dùng Argon2, bcrypt, PBKDF2 hoặc scrypt cho các quy trình mật khẩu và dẫn xuất khóa, nơi chi phí có thể cấu hình quan trọng hơn tốc độ thuần túy.

## Chọn một cách an toàn

Không phải mọi hash đều phù hợp cho bảo mật. MD4, MD5 và SHA-1 hữu ích cho hệ thống cũ và kiểm tra tương thích, nhưng không nên dùng chúng cho các thiết kế toàn vẹn nhạy cảm về bảo mật mới. CRC, Adler-32, MurmurHash, CityHash và xxHash là checksum nhanh hoặc hash dùng để phân nhóm, không phải chữ ký chống sửa đổi. Khi bạn không chắc, hãy ưu tiên SHA-256 cho checksum công khai, HMAC-SHA-256 cho xác minh có khóa, và Argon2id hoặc bcrypt cho lưu trữ mật khẩu.

## Quyền riêng tư và quy trình làm việc

Các công cụ riêng lẻ trong bộ sưu tập này chạy trong trình duyệt. Văn bản và tệp được công cụ đã chọn xử lý cục bộ, trừ khi công cụ đó nêu rõ hành vi tra cứu công khai, điều mà các công cụ hash không cần. Với tài liệu nhạy cảm, hãy xóa các giá trị đã tạo sau khi dùng và tránh dán bí mật vào các phiên trình duyệt dùng chung hoặc đang được ghi lại.
