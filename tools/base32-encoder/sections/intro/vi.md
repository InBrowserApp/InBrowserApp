## Base32 là gì?

Base32 hữu ích khi kênh chỉ hỗ trợ văn bản hoặc kênh không phân biệt chữ hoa chữ thường cần mang dữ liệu nhị phân, như bí mật OTP, token an toàn với DNS hoặc các giá trị cấu hình đã xuất. Đây là một lớp mã hóa biểu diễn, không phải lớp bảo mật.

## Khi nào nên dùng

- Mã hóa byte, văn bản hoặc tệp sang Base32 trước khi gửi qua các kênh chỉ nhận văn bản.
- Chuẩn bị bí mật OTP, cấu hình đã xuất hoặc dữ liệu nhị phân cho các hệ thống yêu cầu đầu vào Base32.
- Chuyển đổi byte tệp thô thành chuỗi dễ sao chép để truyền tải, ghi log hoặc nhập thủ công.

## Điều cần lưu ý

- Base32 làm tăng kích thước dữ liệu nhiều hơn Base64.
- Nó không mã hóa hay che giấu giá trị gốc.
- Một số hệ thống yêu cầu padding `=`, trong khi hệ thống khác chấp nhận đầu ra không có padding, vì vậy nên khớp với phía nhận.
