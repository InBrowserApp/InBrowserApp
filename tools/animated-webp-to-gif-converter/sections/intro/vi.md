## Chuyển ảnh WebP động sang GIF

WebP động lưu nhiều khung hình trong một tệp `.webp`. Chuyển sang GIF khi ứng
dụng trò chuyện, trang tài liệu hoặc nơi bạn muốn chia sẻ ảnh yêu cầu định dạng GIF
cho ảnh động. Công cụ hỗ trợ cả WebP động nén mất dữ liệu và nén không mất dữ liệu.
Mọi thao tác xử lý diễn ra trên thiết bị của bạn.

### Cách chuyển WebP động sang GIF

1. Bấm **Chọn tệp** hoặc thả ảnh WebP động vào công cụ.
2. Bấm **Tạo GIF** để chuyển đổi các khung hình với kích thước gốc.
3. Bấm **Phát** để xem thử, rồi bấm **Tải GIF xuống** để lưu.

### Thời lượng khung hình và số lượt phát thay đổi thế nào?

Thời lượng hiển thị riêng của từng khung hình được làm tròn theo đơn vị 10 ms
của GIF, với mức tối thiểu 20 ms khi phát. Chẳng hạn, hai khung hình dài 100 ms
và 250 ms vẫn giữ nguyên thời lượng. Nếu WebP phát một số lần cố định, GIF giữ
tổng số lượt phát đó. WebP lặp vô hạn sẽ tạo ra GIF lặp vô hạn.

### GIF xử lý độ trong suốt và màu sắc ra sao?

GIF dùng bảng màu theo chỉ mục với tối đa 256 mục mỗi khung hình, trong đó
một mục dành cho vùng trong suốt. WebP có thể lưu độ trong suốt một phần, nên
bóng mờ và cạnh đã khử răng cưa có thể trông khác trong GIF. Khung hình có
nhiều màu cũng có thể xuất hiện các dải màu. Hãy xem trước kết quả trên nền
bạn định dùng.

### Câu hỏi thường gặp

#### Tôi có thể chuyển ảnh WebP tĩnh không?

Công cụ này cần các khung hình động. Cả ảnh tĩnh và ảnh động đều có thể mang
đuôi `.webp`. Dùng [Trình tạo GIF](/vi/tools/gif-maker/) nếu bạn muốn ghép
nhiều ảnh tĩnh thành một ảnh động.

#### Vì sao GIF lớn hơn WebP?

WebP nén màu và các vùng thay đổi giữa những khung hình một cách hiệu quả.
GIF có thể lớn hơn ngay cả khi kích thước và thời lượng trùng khớp. Hãy
kiểm tra dung lượng cạnh bản xem trước nếu nơi đăng ảnh giới hạn tệp tải lên.

### Công cụ ảnh động liên quan

Dùng [Chuyển GIF sang WebP động](/vi/tools/gif-to-animated-webp-converter/)
để chuyển theo chiều ngược lại hoặc [Chuyển APNG sang GIF](/vi/tools/apng-to-gif-converter/)
nếu tệp nguồn là PNG động.
