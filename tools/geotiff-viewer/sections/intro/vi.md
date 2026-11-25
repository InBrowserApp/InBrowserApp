## Cách mở tệp GeoTIFF

Chọn tệp .tif hoặc .tiff, hoặc kéo thả tệp vào trình xem. Nếu chưa có tệp, hãy chọn **Dùng thử ví dụ** để khám phá một raster độ cao nhỏ được tạo sẵn. Bản xem trước và thông tin raster được xử lý ngay trên thiết bị. Tệp không được tải lên máy chủ.

## Xem raster hoặc từng kênh

Dùng mục **Hiển thị** để chuyển giữa ảnh màu (nếu có) và từng kênh. Với một kênh, trình xem kéo giãn các giá trị trên thang độ xám để làm rõ chi tiết. Các pixel có giá trị trùng với giá trị NoData của tệp sẽ trong suốt. Trình xem lấy mẫu raster lớn để hiển thị. Phóng to để xem kỹ bản xem trước, rồi chọn **Vừa khung** để xem lại toàn bộ ảnh.

## Đọc siêu dữ liệu GeoTIFF

GeoTIFF lưu ảnh raster cùng thông tin vị trí của các pixel trên Trái Đất. Kiểm tra kích thước pixel và số kênh để nhận biết bộ dữ liệu. Hệ quy chiếu tọa độ (CRS) và phạm vi tọa độ được đọc từ siêu dữ liệu nhúng trong tệp. Phạm vi dùng hệ tọa độ gốc, với đơn vị có thể là độ hoặc đơn vị của hệ tọa độ chiếu như mét. Tệp TIFF thông thường vẫn mở được dưới dạng ảnh. Nếu tệp thiếu siêu dữ liệu không gian, các mục tương ứng sẽ hiện **Không có**.
