## Kiểm tra lưới STL hoặc OBJ trực tuyến

Chọn **Mở tệp** hoặc thả mô hình `.stl` hay `.obj` vào công cụ. Công cụ đọc lưới trên thiết bị của bạn rồi hiển thị diện tích bề mặt, thể tích bao kín và các lỗi tô pô. Chọn **Thử ví dụ** để kiểm tra một giá đỡ có lưới kín trước khi mở tệp của bạn.

## Đọc diện tích bề mặt và thể tích

Tọa độ STL và OBJ không có đơn vị đo vật lý chung. Đặt **Đơn vị tọa độ** theo đơn vị bạn đã dùng khi xuất mô hình. Diện tích tính theo đơn vị bình phương, còn thể tích tính theo đơn vị lập phương. Việc chọn đơn vị chỉ gắn nhãn cho các giá trị tọa độ đã lưu, không đổi tỷ lệ mô hình. Giá đỡ mẫu có thể tích 16.016 mm³ nếu tọa độ tính bằng milimét.

Diện tích bề mặt là tổng diện tích của các tam giác trong tệp, nên mặt trùng lặp vẫn được tính thêm. Khi lưới vượt qua các bước kiểm tra tô pô, công cụ tính thể tích dựa trên hướng của các mặt. Bề mặt tự giao nhau và các vỏ lưới hướng sai hoặc chồng lấn vẫn có thể ảnh hưởng đến kết quả ước tính. Hãy đối chiếu những kết quả quan trọng với mô hình khối gốc.

## Hiểu kết quả kiểm tra tô pô

- **Cạnh biên** chỉ thuộc một tam giác. Các cạnh biên tạo thành đường viền hở, kể cả đường viền quanh lỗ.
- **Cạnh không đa tạp** thuộc hơn hai tam giác. Một **đỉnh không đa tạp** là đầu mút của một cạnh như vậy hoặc là nơi các nhóm mặt rời nhau gặp tại cùng một đỉnh.
- **Hướng đỉnh không nhất quán** xảy ra khi thứ tự đỉnh của hai tam giác đi qua cạnh chung theo cùng chiều. Với hai mặt kề nhau có hướng đúng, hai chiều này phải ngược nhau.
- **Mặt suy biến** có diện tích bằng 0. **Mặt trùng lặp** là mặt lặp lại cùng một tam giác.

Khi đếm đỉnh, công cụ xem các vị trí trùng khớp hoàn toàn là một đỉnh duy nhất. Các vỏ lưới được đếm dựa trên những cạnh chung giữa các tam giác. Khi phát hiện lỗi tô pô, công cụ vẫn hiển thị diện tích bề mặt và số lỗi. Hãy dùng các số liệu này để xác định phần cần sửa trước khi dùng kết quả thể tích.

## Xem hoặc chuyển đổi mô hình

Dùng [Trình xem STL](../stl-viewer/) hoặc [Trình xem OBJ](../obj-viewer/) để kiểm tra mô hình ở dạng 3D, kể cả chế độ khung dây. Dùng [Trình chuyển đổi OBJ sang STL](../obj-to-stl-converter/) nếu công cụ ở bước tiếp theo cần tệp STL.

Nếu báo cáo STL phát hiện mặt trùng lặp, mặt có diện tích bằng 0 hoặc hướng đỉnh không nhất quán, hãy chọn **Sửa STL** để sửa ngay tệp đang kiểm tra. Trang [Sửa lưới STL](../stl-mesh-repair/) cũng cho phép so sánh các mặt trùng lặp và mặt có diện tích bằng 0, hướng mặt và lỗi tô pô còn lại trước khi tải xuống tệp STL mới.
