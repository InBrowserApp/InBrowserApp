## Chuyển ảnh PNG động sang GIF

APNG lưu nhiều khung hình trong một tệp PNG. Chuyển sang GIF để chia sẻ qua
ứng dụng trò chuyện, diễn đàn hoặc tài liệu dùng GIF để hiển thị ảnh động.
Ảnh động PNG có thể mang đuôi `.apng` hoặc `.png`. Công cụ đọc dữ liệu hoạt ảnh
trong tệp và xử lý ngay trên thiết bị của bạn.

### Cách chuyển APNG sang GIF

1. Bấm **Chọn tệp** hoặc thả ảnh PNG động vào công cụ.
2. Bấm **Tạo GIF** để chuyển đổi các khung hình với kích thước gốc.
3. Bấm **Phát** để xem thử, rồi bấm **Tải GIF xuống** để lưu.

### Thời lượng khung hình và số lượt phát thay đổi thế nào?

Thời lượng hiển thị riêng của từng khung hình được làm tròn theo đơn vị 10 ms
của GIF, với mức tối thiểu 20 ms khi phát. Chẳng hạn, hai khung hình dài 100 ms
và 250 ms vẫn giữ nguyên thời lượng. GIF giữ số lượt phát của tệp nguồn, dù
phát một lần, nhiều lần hay lặp vô hạn. Nếu số lượt phát hữu hạn, GIF hỗ trợ
tối đa 65.536 lượt phát tổng cộng.

### GIF xử lý độ trong suốt và màu sắc ra sao?

APNG hỗ trợ độ trong suốt một phần và khung hình đầy đủ màu sắc. GIF dùng
bảng màu theo chỉ mục với tối đa 256 mục mỗi khung hình, trong đó một mục
dành cho vùng trong suốt. Cạnh mềm và bóng đổ có thể trông sắc hơn, còn vùng
chuyển màu mượt có thể xuất hiện các dải màu. Hãy xem trước GIF trước khi chia sẻ.
Nếu nơi bạn định dùng ảnh hỗ trợ PNG động, tệp gốc giữ được đầy đủ màu sắc và
độ trong suốt một phần.

### Câu hỏi thường gặp

#### Tôi có thể chuyển ảnh PNG thông thường không?

Công cụ cần dữ liệu hoạt ảnh PNG. Tệp có đuôi `.png` vẫn có thể là ảnh động.
Nếu tệp có ảnh dự phòng riêng dành cho trình xem PNG tĩnh, GIF sẽ bắt đầu từ
khung hình động đầu tiên.

#### GIF có nhỏ hơn APNG không?

Dung lượng phụ thuộc vào kích thước ảnh, số khung hình và mức độ chi tiết.
GIF có thể lớn hơn, nhất là khi APNG nguồn chỉ lưu những vùng nhỏ thay đổi
giữa các khung hình. Hãy kiểm tra dung lượng đầu ra cạnh bản xem trước GIF.

### Công cụ ảnh động liên quan

Dùng [Chuyển GIF sang APNG](/vi/tools/gif-to-apng-converter/) để chuyển theo
chiều ngược lại hoặc [Chuyển WebP động sang GIF](/vi/tools/animated-webp-to-gif-converter/)
nếu tệp nguồn là WebP.
