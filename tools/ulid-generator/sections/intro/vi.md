Tạo ULID cục bộ trong trình duyệt cho bản ghi, sự kiện, nhật ký, fixture và hệ thống phân tán cần mã định danh gọn với tiền tố có thể sắp xếp theo thời gian. Mỗi giá trị được tạo trên thiết bị này và có thể sao chép hoặc tải xuống mà không gửi cả lô đến dịch vụ khác.

## Vì Sao Dùng ULID

ULID là viết tắt của Universally Unique Lexicographically Sortable Identifier. Nó kết hợp mốc thời gian mili giây Unix 48 bit với 80 bit ngẫu nhiên, rồi mã hóa kết quả thành chuỗi Crockford Base32 dài 26 ký tự. Cấu trúc đó giúp ULID an toàn trong URL, thân thiện với cơ sở dữ liệu và tự nhiên sắp xếp được theo thời điểm tạo.

## Thời Gian Hiện Tại Hoặc Tùy Chỉnh

Dùng thời gian hiện tại cho bản ghi ứng dụng thông thường, khóa nhập và dữ liệu kiểm thử cần phản ánh thời điểm chúng được tạo. Chuyển sang mốc thời gian tùy chỉnh khi bạn cần mẫu trông có tính xác định, hàng được bổ sung ngược thời gian, sự kiện được phát lại hoặc fixture cần sắp xếp quanh một thời điểm cụ thể.

## Lô Đơn Điệu

Khi bật chế độ lô đơn điệu, các ID được tạo cho cùng một mili giây sẽ tăng dần phần ngẫu nhiên để cả lô vẫn được sắp xếp theo thứ tự từ điển từ trên xuống dưới. Tắt chế độ này khi bạn muốn mỗi hàng dùng một phần ngẫu nhiên mới. Cả hai chế độ đều giữ mốc thời gian hiển thị trong mười ký tự đầu tiên.
