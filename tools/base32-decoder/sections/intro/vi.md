## Base32 là gì?

Base32 hữu ích khi kênh chỉ hỗ trợ văn bản hoặc kênh không phân biệt chữ hoa chữ thường cần mang dữ liệu nhị phân, như bí mật OTP, token an toàn với DNS hoặc các giá trị cấu hình đã xuất. Đây là một lớp mã hóa biểu diễn, không phải lớp bảo mật.

## Khi nào nên dùng

- Giải mã bí mật hoặc token Base32 về lại các byte gốc.
- Kiểm tra các giá trị được sao chép từ cấu hình TOTP, dữ liệu xuất từ tích hợp hoặc tệp cấu hình.
- Xác nhận dữ liệu Base32 được dán vào có ký tự hợp lệ và padding đúng trước khi sử dụng.

## Điều cần lưu ý

- Base32 làm tăng kích thước dữ liệu nhiều hơn Base64.
- Nó không mã hóa hay che giấu giá trị gốc.
- Một số hệ thống bỏ qua padding `=`, nhưng ký tự không hợp lệ vẫn gây lỗi giải mã.
