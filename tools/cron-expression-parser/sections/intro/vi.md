## Hiểu lịch cron trước khi đưa vào vận hành

Biểu thức cron rất cô đọng, nhưng một lỗi nhỏ ở trường có thể khiến tác vụ chạy thường xuyên hơn nhiều, hoặc ít thường xuyên hơn nhiều so với dự định. Trình phân tích này xác thực biểu thức trong trình duyệt của bạn, giải thích lịch bằng ngôn ngữ dễ hiểu, phân rã từng trường và xem trước các thời điểm chạy sắp tới.

### Khi nào nên dùng

- Kiểm tra lịch triển khai, sao lưu, dọn dẹp hoặc thông báo trước khi thêm vào máy chủ, hệ thống CI hoặc trình chạy tác vụ.
- So sánh một biểu thức cron đã sao chép với lịch bạn thực sự mong đợi.
- Học hoặc gỡ lỗi cú pháp cron bằng cách thay đổi từng trường một và quan sát phần giải thích cập nhật.

### Định dạng được hỗ trợ

Công cụ hỗ trợ các biểu thức cron Unix chuẩn gồm năm trường: phút, giờ, ngày trong tháng, tháng và ngày trong tuần. Công cụ cũng chấp nhận biểu thức sáu trường có giây ở đầu cho các bộ lập lịch hỗ trợ độ chính xác đến cấp giây.

### Đọc kết quả

Phần tóm tắt đưa ra mô tả bằng ngôn ngữ dễ hiểu, còn bảng trường cho biết biểu thức thô được tách như thế nào. Các thời điểm chạy sắp tới dùng múi giờ cục bộ của trình duyệt, vì vậy hãy so sánh chúng với múi giờ mà bộ lập lịch sẽ dùng để chạy tác vụ.

### Ghi chú

- Giá trị ngày trong tuần thường dùng `0` hoặc `7` cho Chủ nhật, và các tên như `MON` hoặc `FRI` cũng được chấp nhận.
- Tên tháng như `JAN` hoặc `DEC` có thể giúp lịch vận hành dễ rà soát hơn.
- Nếu bộ lập lịch của bạn dùng một phương ngữ cron khác, hãy xác nhận các ký hiệu đặc biệt như `?`, `L`, `W` hoặc `#` trong tài liệu riêng của bộ lập lịch đó.
