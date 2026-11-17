## Khám phá cơ sở dữ liệu SQLite trong trình duyệt

Mở cơ sở dữ liệu SQLite 3 để duyệt bảng và khung nhìn, kiểm tra cột, chỉ mục, khóa ngoại và câu lệnh CREATE, hoặc chạy truy vấn SQL chỉ đọc. Thử cơ sở dữ liệu mẫu để khám phá không gian làm việc. Tệp của bạn được xử lý cục bộ và không bao giờ bị sửa đổi.

## Truy vấn và xuất kết quả

Chọn một bảng hoặc khung nhìn để tải các hàng, sau đó chỉnh sửa SQL để lọc, sắp xếp hoặc kết hợp dữ liệu. Chạy một câu lệnh SELECT, WITH hoặc EXPLAIN bằng **Chạy truy vấn** hoặc **Ctrl/⌘ + Enter**. Nhấp vào một ô để kiểm tra và sao chép toàn bộ giá trị.

Chọn giới hạn kết quả là 100, 1.000 hoặc 10.000 hàng và duyệt kết quả với 50 hàng mỗi trang. Truy vấn có giới hạn thời gian 10 giây và giới hạn kích thước kết quả 5 MiB. Bản xuất CSV và JSON bao gồm tất cả các hàng đã tải trên mọi trang.

JSON dùng tên cột và mảng hàng riêng biệt để giữ nguyên tên trùng lặp và giá trị NULL. Số nguyên là chuỗi thập phân chính xác, còn BLOB chứa giá trị `$blob` dạng thập lục phân. CSV bao gồm hàng tiêu đề, dùng trường trống cho NULL và thêm dấu nháy đơn trước văn bản giống công thức.

## Tệp SQLite được hỗ trợ

Mở tệp `.db`, `.sqlite` hoặc `.sqlite3` không mã hóa, tối đa 50 MiB. Với cơ sở dữ liệu dùng WAL, hãy tạo bản sao đã được tạo điểm kiểm tra trước khi mở; các tệp WAL và journal đi kèm không được tải. Không hỗ trợ phần mở rộng SQLite tùy chỉnh. Tệp và truy vấn không được tự động lưu.
