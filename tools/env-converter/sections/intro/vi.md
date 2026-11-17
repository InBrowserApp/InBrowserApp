## Chuyển đổi cấu hình môi trường

Dán tệp `.env` rồi chọn JSON hoặc YAML, hoặc chuyển đổi đối tượng JSON/YAML phẳng về `.env`. Nhập tệp cục bộ, hoán đổi đầu vào và đầu ra, rồi sao chép hoặc tải xuống kết quả. Mọi thao tác đều chạy trong trình duyệt; cấu hình không bao giờ được tải lên hoặc lưu vào lịch sử trình duyệt hay bộ nhớ cục bộ.

### Giá trị và dấu nháy

Biến môi trường là chuỗi: `PORT=3000`, `DEBUG=false` và `CODE=0012` vẫn là `"3000"`, `"false"` và `"0012"`. Số và giá trị boolean trong JSON/YAML được chuyển thành chuỗi. Null, mảng và đối tượng lồng nhau cần được thay bằng giá trị chuỗi cụ thể. Đặt các giá trị YAML như `0012` trong dấu nháy khi cần giữ chính xác cách viết.

Trình phân tích hỗ trợ dòng trống, chú thích `#`, tiền tố `export`, cùng dấu nháy đơn, nháy kép hoặc nháy ngược cho giá trị nhiều dòng. Chỉ các chuỗi ký tự `\n` và `\r` trong dấu nháy kép được diễn giải thành ký tự tương ứng. Trong các trường hợp khác, dấu nháy và dấu gạch chéo ngược được giữ nguyên theo cách xử lý dotenv thông dụng. Khóa chỉ chứa chữ cái, chữ số và dấu gạch dưới, đồng thời không được bắt đầu bằng chữ số. Đầu ra chọn kiểu dấu nháy bảo toàn giá trị.

### Kiểm tra cấu hình

Các khóa `.env` trùng lặp được hiển thị kèm số dòng; khai báo cuối cùng sẽ được sử dụng. Dấu nháy chưa đóng, văn bản sau dấu nháy đóng và phép gán không hợp lệ sẽ tạo thông báo lỗi kèm liên kết đến dòng liên quan. Dấu nháy cong sẽ tạo cảnh báo. Khóa trùng trong JSON/YAML được coi là lỗi.

Chú thích, kiểu dấu nháy ban đầu và định dạng không được giữ lại. Các tham chiếu như `${NAME}` và lệnh shell được giữ nguyên, không bao giờ được thực thi. Các trình nạp `.env` có quy tắc khác nhau; công cụ này tuân theo tập quy tắc đã được mô tả thay vì diễn giải tập lệnh shell.

Xem [đặc tả .env của Node.js](https://nodejs.org/api/environment_variables.html#dotenv) và [quy tắc phân tích của dotenv](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
