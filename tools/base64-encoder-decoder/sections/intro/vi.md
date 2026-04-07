## Base64 là gì?

Base64 hữu ích khi một kênh dựa trên văn bản cần mang theo các tải dữ liệu thân thiện với nhị phân, chẳng hạn như nội dung email, đối tượng JSON hoặc các data URL nhỏ. Đây là một lớp mã hóa, không phải lớp bảo mật.

## Khi nào nên dùng

- Gỡ lỗi nhanh khi một API trả về hoặc mong đợi chuỗi Base64.
- Chuyển đổi văn bản trình duyệt sang một định dạng truyền tải an toàn cho nhật ký hoặc tải dữ liệu.
- Kiểm tra xem một khối Base64 đã dán có giải mã thành nội dung bạn mong đợi hay không.

## Cần lưu ý

- Base64 làm tăng kích thước khoảng một phần ba.
- Nó không mã hóa hay che giấu giá trị gốc.
- Phần đệm không hợp lệ hoặc thao tác sao chép-dán bị hỏng thường biểu hiện thành lỗi giải mã.
