## Cách kết nối đàn phím hoặc bộ điều khiển MIDI

Kết nối thiết bị MIDI và kiểm tra xem hệ điều hành đã nhận thiết bị chưa. Chọn **Bật MIDI**, cho phép trình duyệt truy cập MIDI nếu được hỏi, rồi chọn đầu vào. Sử dụng trình duyệt tương thích qua HTTPS. Bộ theo dõi nhận thông điệp từ đầu vào đã chọn và hiển thị chúng trên thiết bị của bạn.

## Cách kiểm tra nốt và velocity

Nhấn một phím hoặc pad và quan sát đàn piano cùng nhật ký thông điệp. Note On hiển thị nốt và velocity, thường có giá trị từ 1 đến 127. Note Off hoặc Note On với velocity bằng 0 sẽ kết thúc nốt. Bàn phím hiển thị nốt MIDI 60 là C4. Thay đổi quãng tám bắt đầu để xem phạm vi khác. Các nốt đang giữ vẫn được liệt kê ngay cả khi nằm ngoài phạm vi hiển thị.

## Cách kiểm tra CC, pitch bend và MIDI Clock

Di chuyển núm, cần gạt hoặc bàn đạp để xem số và giá trị Control Change (CC). Ví dụ, nhiều bàn đạp ngân gửi CC 64. Pitch Bend được hiển thị quanh giá trị trung tâm là 0. Các xung MIDI Clock được đếm riêng với nhật ký thông điệp. MIDI Clock tiêu chuẩn gửi 24 xung cho mỗi nốt đen. Nhật ký bao gồm số kênh và các byte thô ở dạng thập lục phân để kiểm tra từng thông điệp.

## Tại sao đầu vào MIDI không phản hồi?

Kiểm tra cáp, nguồn điện và chế độ thiết bị, đồng thời xác nhận cổng đã chọn khớp với bộ điều khiển. Đóng các ứng dụng khác có thể đang sử dụng đầu vào, rồi kết nối lại thiết bị. Khả năng hỗ trợ tùy thuộc vào trình duyệt và hệ điều hành. Công cụ này nhận các thông điệp MIDI tiêu chuẩn với quyền truy cập MIDI thông thường. Thông điệp System Exclusive (SysEx) dành riêng cho thiết bị cần thêm quyền truy cập.
