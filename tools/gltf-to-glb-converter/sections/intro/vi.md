## Chuyển mô hình glTF thành một tệp GLB

Dùng **Mở tệp** để chọn mô hình `.gltf` cùng các tệp bộ đệm `.bin` và họa tiết. Nếu họa tiết nằm trong thư mục con, dùng **Mở thư mục** để công cụ đọc đúng đường dẫn trong mô hình. Công cụ cũng chấp nhận tệp glTF đã nhúng sẵn dữ liệu. Chọn **Thử ví dụ** để đóng gói mô hình kim tự tháp có hoạt ảnh, rồi chọn **Tải xuống GLB**. Các tệp được xử lý trong trình duyệt.

## Thêm tệp bộ đệm hoặc họa tiết còn thiếu

Tệp JSON `.gltf` có thể tham chiếu đến các tệp như `model.bin` hoặc `textures/albedo.png`. Công cụ liệt kê đường dẫn của các tệp còn thiếu. Chọn **Thêm tệp** để bổ sung các tệp này mà vẫn giữ mô hình đang mở. Hãy giữ nguyên tên tệp. Nếu có các tệp trùng tên nằm ở những thư mục khác nhau, hãy chọn thư mục chứa mô hình và các tệp được tham chiếu để công cụ đọc được đường dẫn của chúng.

## Chia sẻ và kiểm tra GLB

Tệp GLB nhúng hình học, họa tiết được hỗ trợ và dữ liệu chuẩn khác mà mô hình tham chiếu. Lưới, vật liệu và các đoạn hoạt ảnh cũng được giữ lại. Khi đóng gói, công cụ giữ nguyên cách mã hóa họa tiết và nén lưới, nên phần mềm đích cần hỗ trợ các định dạng đó. Họa tiết PNG và JPEG tương thích với nhiều phần mềm glTF nhất. Chỉ cần mở tệp đã tải xuống trong [Trình xem GLB / glTF](../gltf-viewer/) để kiểm tra kích thước, vật liệu và hoạt ảnh. [Định dạng tệp glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
