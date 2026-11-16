## Khóa hệ thống Motorola đời cũ là gì?

Khóa hệ thống dạng phần mềm là tệp `.KEY` được phần mềm lập trình Motorola tương thích sử dụng để cho phép chỉnh sửa các thiết lập được bảo vệ của hệ thống vô tuyến trung kế. Trình tạo này tái tạo định dạng đời cũ có nguồn gốc từ BatLabs cho một ID hệ thống. Khóa hệ thống khác với khóa mã hóa thông tin liên lạc vô tuyến và bản thân nó không cấp quyền truy cập vào mạng vô tuyến.

## Cách sử dụng trình tạo này

1. Nhập ID hệ thống bằng 1–4 chữ số thập lục phân (`0–9`, `A–F`), không có tiền tố `0x`. Chữ thường được chấp nhận và ID ngắn được đệm bằng các số không ở đầu: `ab` trở thành `00AB`.
2. Kiểm tra ID đã chuẩn hóa, tên tệp và bản xem trước dạng thập lục phân.
3. Tải xuống tệp nhị phân `.KEY` và nạp vào phần mềm lập trình đời cũ tương thích. Tệp có kích thước 27 byte; ID hệ thống `1234` tạo ra `SYS01234.KEY`.

## Giới hạn tương thích

Công cụ này tuân theo một định dạng đời cũ đã được công bố; khả năng tương thích phụ thuộc vào phần mềm lập trình. Công cụ không hỗ trợ ASTRO 25 Portable CPS (bao gồm XTS5000), APX CPS hoặc Advanced System Keys (ASK). Việc khớp với định dạng byte tham chiếu không xác nhận khả năng tương thích với một bộ đàm hoặc phiên bản CPS cụ thể.

## Quyền riêng tư

Việc tạo, xác thực và xem trước tệp đều được thực hiện cục bộ trong trình duyệt của bạn. ID hệ thống và khóa được tạo không được gửi đến máy chủ.
