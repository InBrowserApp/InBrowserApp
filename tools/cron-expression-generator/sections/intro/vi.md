## Tạo lịch Cron trực quan

Biểu thức cron rất ngắn gọn, nhưng một thay đổi nhỏ ở sai trường có thể chuyển một tác vụ từ "các buổi sáng ngày thường" thành "mỗi phút". Trình tạo này cung cấp điều khiển riêng cho từng trường để bạn có thể tạo biểu thức năm trường tiêu chuẩn mà không cần ghi nhớ mọi quy tắc cú pháp.

### Khi công cụ hữu ích

- Tạo lịch cho tác vụ CI, sao lưu, làm nóng bộ nhớ đệm, báo cáo và các tác vụ lặp lại khác.
- Bắt đầu từ một mẫu đã biết và tinh chỉnh từng trường một.
- Xem trước các thời điểm chạy địa phương sắp tới trước khi dán biểu thức vào bộ lập lịch.

### Cách sử dụng

1. Chọn một mẫu nhanh, hoặc giữ biểu thức mặc định và chỉnh sửa từng trường theo cách thủ công.
2. Chọn xem mỗi trường nên chạy trên mọi giá trị, một khoảng lặp, các giá trị cụ thể hay một phạm vi.
3. Xem lại biểu thức đã tạo và bản xem trước lần chạy tiếp theo, rồi sao chép vào bộ lập lịch của bạn.

### Ghi chú

- Công cụ này tạo cron năm trường tiêu chuẩn: phút, giờ, ngày trong tháng, tháng và ngày trong tuần.
- Chủ nhật được hiển thị là `0`, được các bộ lập lịch cron kiểu Unix phổ biến chấp nhận.
- Nếu cả ngày trong tháng và ngày trong tuần đều bị giới hạn, nhiều bản triển khai cron sẽ chạy khi một trong hai trường khớp. Một số hệ thống có thể khác, vì vậy hãy xác minh tổ hợp đó trong bộ lập lịch đích của bạn.
