Tạo một lô định danh UUID v4 trực tiếp trong trình duyệt khi bạn cần ID ngẫu nhiên cho các hàng cơ sở dữ liệu, dữ liệu mẫu API, khóa đối tượng, payload kiểm thử, mẫu nhập dữ liệu hoặc công việc vận hành một lần.

## What UUID v4 Provides

UUID v4 là định danh 128 bit được tạo chủ yếu từ các byte ngẫu nhiên bảo mật bằng mật mã. Các bit phiên bản và biến thể được cố định theo bố cục RFC 4122, nên UUID v4 có dạng quen thuộc `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` trong khi vẫn có không gian ngẫu nhiên rất lớn.

## Pick A Practical Batch Size

Lô mặc định cung cấp đủ ID cho nhiều quy trình dữ liệu mẫu và bảng tính mà không làm trang khó đọc. Tăng số lượng khi bạn chuẩn bị một đợt nhập dữ liệu lớn hơn, hoặc giảm xuống khi bạn chỉ cần vài định danh cho mẫu yêu cầu hoặc chỉnh sửa cơ sở dữ liệu thủ công.

## Copy Or Export

Xem lại danh sách đã tạo, rồi sao chép vào trình soạn thảo của bạn hoặc tải xuống tệp văn bản thuần. Mọi giá trị đều được tạo cục bộ, và lô hiện tại không bao giờ được công cụ này tải lên.

## Collision Guidance

Rủi ro trùng lặp UUID v4 là cực kỳ thấp đối với khối lượng công việc ứng dụng thông thường, nhưng nó không thay thế cho ràng buộc duy nhất trong cơ sở dữ liệu. Hãy tiếp tục thực thi tính duy nhất ở nơi ID trở thành khóa chính, token công khai hoặc tham chiếu lâu dài.
