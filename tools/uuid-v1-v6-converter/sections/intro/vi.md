UUID v1 và UUID v6 chứa cùng thông tin cốt lõi: dấu thời gian, chuỗi đồng hồ và định danh node. UUID v1 lưu dấu thời gian theo thứ tự trường UUID lịch sử, còn UUID v6 sắp xếp lại các bit dấu thời gian đó để việc sắp xếp từ điển đơn giản bám sát thời điểm tạo một cách tự nhiên hơn.

Hãy dùng công cụ này khi bạn cần chuyển định danh giữa các hệ thống yêu cầu bố cục UUID dựa trên thời gian khác nhau. Dán UUID v1 để nhận UUID v6 tương đương, hoặc dán UUID v6 để khôi phục biểu diễn UUID v1. Quá trình chuyển đổi có tính xác định và giữ nguyên chuỗi đồng hồ cùng các byte node.

## Khi nào nên dùng

- Di chuyển bản ghi từ nơi lưu trữ UUID v1 cũ sang UUID v6 trong khi vẫn giữ siêu dữ liệu định danh.
- Gỡ lỗi cơ sở dữ liệu, nhật ký hoặc hàng đợi có trộn lẫn giá trị UUID v1 và UUID v6.
- Kiểm tra xem một giá trị UUID v6 có ánh xạ ngược về giá trị UUID v1 mà tích hợp cũ mong đợi hay không.

## Định dạng đầu vào

Bộ chuyển đổi chấp nhận chuỗi UUID chuẩn có dấu gạch nối, chuỗi UUID rút gọn 32 ký tự, UUID viết hoa, giá trị `urn:uuid:` và UUID được bọc trong dấu ngoặc nhọn. Kết quả luôn được chuẩn hóa về dạng UUID chuẩn chữ thường.

## Ghi chú về quyền riêng tư và khả năng tương thích

UUID v1 và UUID v6 có thể mã hóa thời điểm tạo và thông tin node. Hãy xem chúng là định danh vận hành, không phải bí mật, và tránh để lộ chúng khi siêu dữ liệu dấu thời gian hoặc node có thể nhạy cảm. Công cụ này chạy cục bộ trong trình duyệt của bạn và không tải UUID của bạn lên.
