## Xuất sự kiện lịch ICS sang CSV

Chọn **ICS sang CSV**, mở hoặc dán tệp iCalendar rồi chọn **Chuyển đổi**. Bảng tính có một dòng cho mỗi mục sự kiện, kèm tiêu đề, thời điểm bắt đầu, thời điểm kết thúc, địa điểm, mô tả và quy tắc lặp lại nếu có. Tải CSV để xem lại hoặc chỉnh sửa trong Excel hoặc Google Sheets. Với sự kiện cả ngày, cột thời gian chỉ ghi ngày và ngày kết thúc không nằm trong thời gian diễn ra. Ví dụ, sự kiện diễn ra cả ngày 12 tháng 5 có ngày kết thúc là 13 tháng 5.

## Tạo tệp ICS từ các dòng CSV

Chọn **CSV sang ICS** rồi chọn **Thử ví dụ** để xem các tiêu đề cột. Cần có ít nhất cột `Title` và `Start`. Dùng `2026-05-12` cho sự kiện cả ngày, `2026-05-12T09:00:00` cho giờ địa phương hoặc `2026-05-12T09:00:00Z` cho giờ UTC. Công cụ cũng nhận diện các tiêu đề của Google Calendar như `Subject`, `Start Date`, `Start Time` và `All Day Event`. Tải xuống tệp ICS rồi nhập các sự kiện vào lịch.

## Giữ lịch gốc để có bản sao lưu đầy đủ

CSV lưu chi tiết sự kiện theo từng dòng. Chuỗi sự kiện lặp lại được lưu bằng quy tắc lặp, không tạo riêng từng ngày. Các định nghĩa múi giờ được nhúng trong tệp cũng được giữ lại. Tệp đính kèm, lời nhắc, người tham dự, các lần lặp bị loại trừ và trạng thái hủy vẫn nằm trong lịch gốc. Quá trình chuyển đổi diễn ra ngay trong trình duyệt.
