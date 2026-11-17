## Kiểm tra tệp SQLite cục bộ

Mở cơ sở dữ liệu SQLite 3 để duyệt các bảng và khung nhìn, kiểm tra định nghĩa cột, chỉ mục, khóa ngoại và câu lệnh CREATE, hoặc chạy truy vấn SQL chỉ đọc. Thử cơ sở dữ liệu mẫu để khám phá không gian làm việc mà không cần chọn tệp. Tệp và truy vấn luôn ở trong trình duyệt của bạn và không được tự động lưu.

## Truy vấn và xuất kết quả

Chọn một bảng để xem trước các hàng. Chỉnh sửa SQL rồi dùng **Chạy truy vấn** hoặc **Ctrl/⌘ + Enter** để thực thi một câu lệnh SELECT, WITH hoặc EXPLAIN. Giới hạn kết quả hạn chế số hàng được tải; mỗi trang hiển thị 50 hàng. Truy vấn cũng có thể dừng khi đạt mức dung lượng kết quả 5 MiB hoặc sau 10 giây. Thao tác hủy giúp giao diện tiếp tục phản hồi và tải lại bản chụp cơ sở dữ liệu khi chạy truy vấn tiếp theo.

Bản xuất CSV và JSON chứa kết quả đã tải, bao gồm cả các hàng trên trang khác. JSON lưu riêng tên cột và mảng hàng, giữ nguyên tên trùng lặp và giá trị NULL. Số nguyên SQLite được chuyển thành chuỗi thập phân chính xác, còn BLOB được chuyển thành đối tượng có giá trị `$blob` dạng thập lục phân. CSV dùng trường trống cho NULL, đặt các ký tự đặc biệt trong dấu nháy và thêm dấu nháy đơn trước văn bản giống công thức để sử dụng an toàn hơn trong bảng tính.

## Cơ sở dữ liệu được hỗ trợ và giới hạn

Mở tệp `.db`, `.sqlite` hoặc `.sqlite3` không mã hóa, tối đa 50 MiB. Tệp gốc không bao giờ bị sửa đổi. Công cụ này tải bản chụp vào bộ nhớ, vì vậy mức sử dụng bộ nhớ có thể lớn hơn kích thước tệp. Các tệp WAL và journal đi kèm không được nhập; hãy tạo một bản sao sạch đã được tạo điểm kiểm tra bằng ứng dụng cơ sở dữ liệu trước khi mở ở đây. Không hỗ trợ cơ sở dữ liệu mã hóa, phần mở rộng SQLite tùy chỉnh và chỉnh sửa cơ sở dữ liệu.
