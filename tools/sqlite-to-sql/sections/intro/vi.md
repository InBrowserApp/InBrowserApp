## Cách xuất cơ sở dữ liệu SQLite sang tệp SQL

Mở hoặc thả tệp cơ sở dữ liệu SQLite 3, chẳng hạn như `.db`, `.sqlite` hoặc `.sqlite3`. Công cụ sẽ tự động tạo bản kết xuất SQL. Bật **Chỉ xuất lược đồ** để xuất cấu trúc cơ sở dữ liệu và bỏ qua các hàng trong bảng. Sau đó, chọn **Tải tệp .sql** để lưu toàn bộ tập lệnh. Bạn có thể thử cơ sở dữ liệu mẫu để xem kết quả.

## Bản kết xuất SQL của SQLite chứa những gì?

Bản kết xuất SQL là tập lệnh dạng văn bản dùng để tạo lại cơ sở dữ liệu. Tệp chứa các câu lệnh `CREATE` cho bảng, chỉ mục, khung nhìn và trình kích hoạt. Bản xuất đầy đủ có thêm các câu lệnh `INSERT` cho từng hàng trong bảng. Bạn có thể dùng tệp này để xem lại thay đổi lược đồ trong Git, giữ bản sao lưu dễ đọc hoặc chuyển cơ sở dữ liệu sang một môi trường SQLite khác.

Tệp gốc vẫn ở trên thiết bị của bạn. Nếu cơ sở dữ liệu dùng nhật ký ghi trước (WAL), hãy xuất một bản sao có thể mở độc lập. Dùng ứng dụng đã tạo cơ sở dữ liệu hoặc lệnh sao lưu của SQLite để đưa cả những thay đổi đã được xác nhận trong nhật ký vào bản sao.

## Cách khôi phục bản kết xuất SQL

Chạy lệnh sau để nhập tập lệnh vào cơ sở dữ liệu SQLite mới.

```sh
sqlite3 restored.sqlite < database.sql
```

Thay `database.sql` bằng tên tệp bạn tải xuống. Tập lệnh dùng cú pháp SQLite. Nếu cơ sở dữ liệu có bảng ảo hoặc phần mở rộng, hãy khôi phục trong một bản cài đặt SQLite có các mô-đun cần thiết.

Để duyệt bảng hoặc xuất kết quả truy vấn dưới dạng CSV hay JSON, hãy mở [Trình xem SQLite](../sqlite-viewer/). Để tạo cơ sở dữ liệu từ bảng tính, hãy dùng công cụ [Chuyển đổi CSV và Excel sang SQLite](../csv-excel-to-sqlite/).
