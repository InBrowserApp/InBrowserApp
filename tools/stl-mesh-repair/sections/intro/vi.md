## Sửa tệp STL trực tuyến

Chọn **Mở tệp** hoặc thả tệp `.stl` dạng ASCII hay nhị phân vào công cụ. Công cụ sửa lưới trên thiết bị của bạn. Chọn **Thử ví dụ** để xem một lưới nhỏ có mặt trùng lặp, mặt có diện tích bằng 0 và mặt bị đảo hướng. So sánh kết quả rồi chọn **Tải xuống STL** để lưu tệp mới với kích thước và tọa độ gốc. Nếu STL nhị phân làm tròn tọa độ gốc, tệp tải xuống sẽ dùng dạng ASCII.

## Công cụ sửa lưới thay đổi những gì

Công cụ loại bỏ các tam giác trùng khớp hoàn toàn và tam giác có diện tích bằng 0. Công cụ so sánh hướng của các mặt kề nhau. Nếu một trong hai cách tạo hướng mặt nhất quán cần đảo ít mặt hơn, công cụ chọn cách đó. Các điểm của lưới giữ nguyên vị trí. Đường biên hở, mặt có hướng chưa xác định rõ và chỗ nối không đa tạp có thể cần sửa thủ công. Các lỗ, điểm gần trùng nhau và phần giao nhau được giữ nguyên. [Các lỗi lưới thường gặp khi in 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## So sánh tô pô trước và sau khi sửa

Kiểm tra số tam giác, mặt trùng lặp và mặt suy biến. Báo cáo cũng liệt kê số cạnh có hướng đỉnh không nhất quán, cạnh biên, cạnh không đa tạp và đỉnh không đa tạp còn lại. Mở tệp tải xuống trong [Trình xem STL](../stl-viewer/) để xem ở dạng 3D. Để xem diện tích bề mặt hoặc thể tích bao kín, dùng [Công cụ kiểm tra thể tích và tô pô lưới](../mesh-inspector/). Báo cáo kiểm tra STL hiển thị **Sửa STL** khi phát hiện mặt trùng lặp, mặt suy biến hoặc hướng đỉnh không nhất quán.
