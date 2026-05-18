# Trình giải mã UUID là gì?

Trình giải mã UUID giải thích cấu trúc bên trong một định danh duy nhất toàn cục. Công cụ chuẩn hóa các định dạng thường được dán vào, kiểm tra giá trị có phải UUID 128 bit hay không, rồi hiển thị phiên bản, biến thể, các byte thập lục phân thô và các dạng biểu diễn số có thể sao chép ngay.

UUID thường được xem như chuỗi không cần biết cấu trúc bên trong, nhưng nibble phiên bản cho biết mã định danh được tạo như thế nào. UUID phiên bản 4 là ngẫu nhiên, phiên bản 3 và 5 là băm dựa trên tên, còn các phiên bản sắp xếp theo thời gian như 1, 6 và 7 có thể mang thông tin dấu thời gian.

## Khi nào nên dùng

Dùng công cụ này khi bạn cần kiểm tra một mã định danh từ log, cơ sở dữ liệu, API, trace hoặc fixture kiểm thử. Công cụ hữu ích để xác nhận UUID là ngẫu nhiên hay dựa trên thời gian, chuyển đổi UUID sang thập phân hoặc Base64 cho hệ thống khác, và phát hiện liệu trường nút của UUID v1 hoặc v6 có thể lộ mã định danh kiểu MAC hay không.

Trình giải mã chạy trong trình duyệt của bạn và không gửi giá trị UUID đến máy chủ. Công cụ chấp nhận UUID dạng chuẩn, giá trị `urn:uuid:`, UUID đặt trong dấu ngoặc nhọn, đầu vào chữ hoa và UUID thập lục phân 32 ký tự không có dấu gạch nối.

## Những điều cần chú ý

Các trường phiên bản và biến thể của UUID mô tả bố cục bit, chứ không chứng minh mã định danh đó thật sự duy nhất trên toàn cầu trong thực tế. Một UUID trông hợp lệ vẫn có thể bị trùng nếu được tạo kém hoặc bị sao chép nhầm.

Với UUID phiên bản 1 và phiên bản 6, trường nút có thể trông giống địa chỉ MAC. Các bộ sinh hiện đại có thể đặt bit multicast và dùng một nút ngẫu nhiên thay vào đó, nên hãy xem nó là mã định danh nút trừ khi bạn kiểm soát bộ sinh.
