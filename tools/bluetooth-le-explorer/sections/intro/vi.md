## Cách kết nối với thiết bị Bluetooth năng lượng thấp

Bật Bluetooth và đặt thiết bị ở chế độ có thể kết nối. Chọn **Kết nối thiết bị** rồi chọn thiết bị ngoại vi trong trình duyệt. Công cụ này yêu cầu quyền truy cập các dịch vụ GATT phổ biến như dịch vụ pin, thông tin thiết bị, nhịp tim và cảm biến môi trường. Với dịch vụ GATT tùy chỉnh, hãy nhập UUID trước khi mở hộp chọn thiết bị. Sử dụng UUID 16 bit như `180F` hoặc UUID 128 bit đầy đủ trong tài liệu của thiết bị.

## Cách đọc đặc điểm GATT

Mở rộng một dịch vụ để xem các đặc điểm và thao tác được hỗ trợ. Chọn **Đọc** để yêu cầu giá trị hiện tại. Hex hiển thị chính xác các byte nhận được, còn UTF-8 hữu ích cho các đặc điểm chứa văn bản. Mức pin, số đo hoặc giá trị nhị phân khác có thể cần được diễn giải theo thông số kỹ thuật của đặc điểm đó.

## Cách ghi lại thông báo Bluetooth

Chọn **Đăng ký** trên một đặc điểm hỗ trợ thông báo hoặc chỉ báo. Các cập nhật xuất hiện cùng thời gian và UUID của đặc điểm. Tải 100 thông báo gần nhất dưới dạng tệp JSON để xem sau, hoặc chọn **Hủy đăng ký** để dừng luồng đó. Trang lưu nhật ký cục bộ.

## Tại sao tôi không thấy thiết bị hoặc dịch vụ của thiết bị?

Khả năng hỗ trợ Web Bluetooth phụ thuộc vào trình duyệt và hệ điều hành. Hãy dùng trình duyệt được hỗ trợ qua HTTPS, để thiết bị ở gần và ngắt kết nối thiết bị khỏi các ứng dụng khác nếu thiết bị chỉ cho phép một kết nối. Trình duyệt cho phép truy cập các dịch vụ GATT đã được cấp quyền trên thiết bị ngoại vi Bluetooth LE. Thiết bị Bluetooth Classic, chẳng hạn tai nghe chỉ cung cấp các cấu hình âm thanh, cần một giao diện khác.
