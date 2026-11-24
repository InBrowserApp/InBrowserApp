## Cách chuyển SVG sang PDF

1. Thả tệp `.svg` vào công cụ hoặc bấm **Chọn SVG**. Bấm **Thử tệp mẫu** nếu bạn muốn thử xuất PDF ngay.
2. Kiểm tra bản xem trước của SVG. Giữ **Kích thước SVG gốc** nếu logo, biểu tượng hoặc hình minh họa cần một trang có kích thước riêng. Chọn **A4** hoặc **US Letter** khi cần khổ giấy tiêu chuẩn.
3. Bấm **Tải PDF xuống** để lưu tệp PDF một trang, có cùng tên với tệp SVG và đổi phần mở rộng thành `.pdf`. Trình duyệt xử lý chuyển đổi ngay trên thiết bị của bạn.

## Những thành phần nào vẫn ở dạng vectơ trong PDF?

Đường dẫn, hình dạng, phần tô và nét viền được vẽ trực tiếp trong PDF, nên logo, sơ đồ và hình vẽ nét vẫn sắc nét khi phóng to hoặc in. Ảnh bitmap nhúng thuộc định dạng được hỗ trợ, chẳng hạn như ảnh PNG, giữ nguyên độ phân giải gốc. Trước khi chia sẻ, bạn có thể phóng to PDF để kiểm tra các nét mảnh và đường cong.

## Khổ trang PDF được xác định như thế nào?

**Kích thước SVG gốc** lấy kích thước vùng vẽ của SVG hoặc tính kích thước từ `viewBox`. Công cụ dùng tỷ lệ chuẩn 96 pixel SVG mỗi inch. Ví dụ, tệp SVG kích thước 960 × 480 px cho ra trang PDF kích thước 10 × 5 inch. Với **A4** và **US Letter**, công cụ đặt đồ họa giữa trang, chừa lề, giữ tỷ lệ và chọn hướng giấy ngang hoặc dọc theo đồ họa.

## Vì sao PDF trông khác bản xem trước SVG?

Bản xem trước SVG được trình duyệt hiển thị. Bộ kết xuất PDF hỗ trợ các thành phần đồ họa vectơ phổ biến, nhưng phông chữ tùy chỉnh, bộ lọc, mặt nạ và hiệu ứng có thể hiển thị khác hoặc bị bỏ qua. Công cụ bỏ qua tài nguyên bên ngoài. Để giữ hình dáng chữ và màu sắc, hãy chuyển chữ thành đường dẫn trong trình thiết kế, nhúng ảnh PNG hoặc JPEG, giản lược các hiệu ứng phức tạp và kiểm tra PDF đã tải xuống trước khi in.
