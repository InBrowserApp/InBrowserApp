## Cách dùng terminal nối tiếp trong trình duyệt

Kết nối Arduino, ESP32, Raspberry Pi Pico hoặc bộ chuyển đổi USB sang nối tiếp bằng cáp dữ liệu. Đặt tốc độ baud của thiết bị, chẳng hạn 9600 hoặc 115200, rồi chọn **Kết nối** và chọn cổng của thiết bị trong trình duyệt. Công cụ giám sát nối tiếp này dùng 8 bit dữ liệu, không có bit chẵn lẻ, một bit dừng và không kiểm soát luồng (8N1).

## Gửi văn bản và byte thập lục phân

Văn bản được gửi dưới dạng UTF-8. Chọn LF, CR hoặc CR + LF nếu thiết bị dùng ký tự kết thúc dòng để gửi lệnh. Với lệnh nhị phân, chọn **Thập lục phân** và nhập các byte đầy đủ như `41 54 0D 0A`. Chế độ thập lục phân gửi byte đúng như đã nhập, không tự động thêm ký tự kết thúc dòng.

## Đọc và lưu nhật ký nối tiếp

Nhật ký hiển thị dữ liệu nhận (RX) và gửi (TX) kèm thời gian. Chuyển sang chế độ thập lục phân để kiểm tra từng byte nếu văn bản bị lỗi. Tạm dừng cuộn để xem mục trước đó trong khi dữ liệu vẫn tiếp tục đến, hoặc tải phần nhật ký được giữ lại dưới dạng tệp văn bản. Dữ liệu nối tiếp ở trong thẻ này cho đến khi bạn chọn lưu.

## Tại sao tôi không thể kết nối với thiết bị?

Dùng trình duyệt cập nhật có hỗ trợ Web Serial và đảm bảo hệ điều hành nhận diện được cổng nối tiếp. Hãy thử cáp khác và đóng các công cụ giám sát nối tiếp khác đang dùng cổng. Nếu thiết bị kết nối nhưng văn bản không đọc được, hãy kiểm tra tốc độ baud và thử xem các byte ở dạng thập lục phân.
