# Mã hóa AES là gì?

AES là một thuật toán mã hóa đối xứng, nghĩa là cùng một bí mật được dùng để mã hóa và giải mã dữ liệu. Công cụ này chạy hoàn toàn trong trình duyệt của bạn và sử dụng Web Crypto API, nên văn bản gốc, mật khẩu và các tệp đã chọn không được tải lên.

Chế độ mặc định là AES-GCM vì chế độ này vừa mã hóa vừa xác thực đầu ra. Xác thực rất quan trọng: nếu bản mã, salt hoặc IV thay đổi sau đó, quá trình giải mã nên thất bại thay vì trả về dữ liệu đã bị sửa đổi. AES-CBC và AES-CTR có sẵn để tương thích, nhưng bản thân chúng không xác thực bản mã.

## Khi nào nên dùng công cụ này

Dùng công cụ này khi bạn cần bảo vệ ghi chú, token, đoạn cấu hình hoặc tệp nhỏ trước khi lưu trữ hay chia sẻ qua một kênh khác. Đầu ra là một phong bì JSON chứa chế độ, thiết lập dẫn xuất khóa, salt, IV và bản mã, để các tham số đó luôn đi cùng nhau cho bước giải mã tương ứng.

Với mã hóa dựa trên mật khẩu, mật khẩu được xử lý bằng PBKDF2 và một salt ngẫu nhiên. Hãy tăng số vòng lặp khi bạn có thể chấp nhận mã hóa và giải mã chậm hơn. Với mã hóa bằng khóa thô, hãy dán một khóa thập lục phân có đúng độ dài đã chọn: 32 ký tự hex cho 128-bit, 48 cho 192-bit hoặc 64 cho 256-bit.

## Ghi chú thực tế

Giữ mật khẩu hoặc khóa thô tách biệt khỏi JSON đã mã hóa. Bất kỳ ai có cả JSON và vật liệu khóa đều có thể giải mã dữ liệu. Nếu bạn mã hóa một tệp, hãy tải kết quả JSON xuống và lưu riêng tên tệp gốc nếu ngữ cảnh đó quan trọng.

Không dùng lại IV thủ công với cùng một khóa. Công cụ này tạo IV và salt mới cho mỗi lần chạy, đây là mặc định an toàn hơn. Ưu tiên AES-GCM trừ khi hệ thống khác yêu cầu cụ thể AES-CBC hoặc AES-CTR.
