## Giá trị băm văn bản hoặc tệp là gì?

Hàm băm chuyển văn bản hoặc byte của tệp thành một giá trị băm có độ dài cố định. Cùng một đầu vào và thuật toán luôn tạo ra cùng một giá trị băm, nên kết quả này hữu ích khi bạn cần một dấu vân tay có thể lặp lại mà không phải tải dữ liệu riêng tư lên.

## Khi nào nên dùng công cụ này

Dùng công cụ này để xác minh checksum tải xuống, so sánh xem hai tệp có giống hệt nhau không, ghi lại nhanh dấu vân tay cho một đoạn văn bản, hoặc gỡ lỗi các hệ thống công bố giá trị băm SHA. Khi nhập tệp, công cụ băm trực tiếp các byte của tệp; còn chế độ văn bản sẽ băm văn bản UTF-8 hiển thị trong trình soạn thảo.

## Chọn thuật toán

SHA-256 là lựa chọn mặc định vững chắc cho các kiểm tra tính toàn vẹn mới. SHA-384 và SHA-512 cung cấp giá trị băm SHA-2 dài hơn khi hệ thống khác yêu cầu các định dạng đó. SHA-1 được đưa vào để so sánh với hệ thống cũ, nhưng không nên dùng cho các thiết kế mới nhạy cảm về bảo mật.

## Quyền riêng tư và giới hạn

Việc băm chạy cục bộ trong trình duyệt của bạn thông qua Web Crypto, và tệp không được tải lên. Giá trị băm không phải là mã hóa: tự nó không thể bảo vệ bí mật, và việc lưu trữ mật khẩu cần một hàm băm mật khẩu chuyên dụng có salt và hệ số công việc.
