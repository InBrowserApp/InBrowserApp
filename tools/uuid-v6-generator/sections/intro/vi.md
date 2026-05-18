Trình tạo UUID v6 tạo các UUID dựa trên thời gian, giữ hình dạng UUID quen thuộc đồng thời đưa dấu thời gian lên trước để sắp xếp từ vựng một cách tự nhiên. Công cụ chạy hoàn toàn trong trình duyệt của bạn, nên các mã định danh được tạo và giá trị nút tùy chọn không bao giờ rời khỏi trang.

## Khi UUID v6 hữu ích

Dùng UUID v6 khi bạn cần các mã định danh vẫn tương thích rộng rãi với công cụ UUID nhưng cũng sắp xếp gần với thứ tự tạo trong nhật ký, chỉ mục cơ sở dữ liệu, luồng sự kiện hoặc tập lệnh di chuyển. Về mặt ngữ nghĩa, UUID v6 gần với UUID v1 nhất: nó dùng dấu thời gian Gregory, chuỗi đồng hồ và trường nút 48 bit, nhưng sắp xếp lại các bit dấu thời gian để ID mới hơn được xếp sau ID cũ hơn.

## ID nút và quyền riêng tư

Các trình tạo UUID v1 cổ điển thường dùng địa chỉ MAC thật làm trường nút. Theo mặc định, công cụ này dùng một ID nút ngẫu nhiên được quản trị cục bộ cho mỗi UUID được tạo, vì vậy nó không làm lộ địa chỉ phần cứng. Chỉ chuyển sang nút tùy chỉnh khi bạn chủ đích cần đầu ra tương thích với v1 cho dữ liệu kiểm thử, kiểm tra khả năng tương tác hoặc hệ thống được kiểm soát.

## Chuỗi đồng hồ và thời gian tùy chỉnh

Chuỗi đồng hồ giúp tránh va chạm khi dấu thời gian lặp lại hoặc đồng hồ chạy lùi. Chuỗi ngẫu nhiên mặc định là lựa chọn an toàn nhất cho nhu cầu sử dụng thông thường. Dấu thời gian, ID nút và chuỗi đồng hồ tùy chỉnh hữu ích cho các ví dụ xác định, nhưng cần thận trọng khi dùng lặp lại các giá trị tùy chỉnh trong dữ liệu sản xuất.
