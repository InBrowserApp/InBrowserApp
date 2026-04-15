## Công cụ này dùng để làm gì?

Dùng công cụ này để đo chính xác khoảng thời gian đã trôi qua giữa hai
ngày giờ địa phương, ngay cả khi chúng thuộc hai múi giờ IANA khác
nhau. Nó hữu ích khi bạn cần một kết quả đáng tin cậy mà không phải tự
đổi độ lệch hay đoán ảnh hưởng của giờ mùa hè.

## Các trường hợp thường gặp

- So sánh thời điểm bắt đầu ở một thành phố với thời điểm kết thúc ở
  thành phố khác.
- Đo thời gian đã trôi qua giữa các bản ghi log, sự cố, chuyến bay hoặc
  khung giờ hỗ trợ được ghi ở các múi giờ khác nhau.
- Kiểm tra xem hai dấu thời gian có đi qua nửa đêm, cuối tuần hay lần
  chuyển giờ mùa hè hay không.

## Công cụ này hoạt động như thế nào?

- Nhập ngày giờ địa phương của thời điểm bắt đầu và kết thúc theo định
  dạng `YYYY-MM-DD HH:mm:ss.SSS`, rồi chọn múi giờ cho từng bên.
- Công cụ chuyển cả hai dấu thời gian sang UTC ở bên trong, sau đó hiển
  thị khoảng thời gian có dấu, khoảng thời gian tuyệt đối, khoảng thời
  gian ISO 8601 và các tổng từ mili giây đến ngày.
- Dùng `Now` để điền nhanh thời gian hiện tại hoặc `Swap` để đảo chiều
  so sánh. Độ lệch có thể thay đổi quanh các thời điểm chuyển giờ mùa
  hè.
