## Công cụ này làm gì

SVG Optimizer này nén một tệp SVG cục bộ hoặc tài liệu SVG được dán trực tiếp
trong trình duyệt của bạn. Công cụ dùng các lượt SVGO cleanup để xóa nhận xét,
metadata, thuộc tính dư thừa, độ chính xác không cần thiết và các markup khác
không làm thay đổi hình ảnh hiển thị.

## Vì sao công cụ hữu ích

Các tệp SVG xuất từ công cụ thiết kế thường chứa metadata của trình chỉnh sửa,
đường dẫn dài dòng, ID không dùng và nhận xét. Tối ưu hóa chúng có thể giảm kích
thước tải xuống, cải thiện tốc độ tải trang và giúp mã SVG inline dễ rà soát hơn
trước khi đưa vào website, ứng dụng, email hoặc trang tài liệu.

## Cách hoạt động

Tải lên một tệp `.svg` hoặc dán markup SVG, chọn preset an toàn hoặc tinh chỉnh
từng lượt SVGO, rồi chạy tối ưu hóa. Công cụ hiển thị bản xem trước gốc và đã
tối ưu, số byte tiết kiệm được và markup cuối cùng để bạn có thể sao chép hoặc
tải xuống tệp `.optimized.svg`. SVG không cần rời khỏi thiết bị của bạn.

## Ghi chú thực tế

- Giữ preset an toàn khi SVG phụ thuộc vào CSS bên ngoài, ID dùng trong script,
  hoặc tham chiếu symbol mà bạn không thể dễ dàng kiểm tra.
- Dùng preset mạnh cho các biểu tượng, logo và minh họa xuất ra đơn giản, khi
  việc xóa kích thước và inline styles là chấp nhận được.
- Xem trước hình ảnh đã tối ưu trước khi thay thế artwork nguồn, đặc biệt khi
  nguồn dùng mask, gradient, filter hoặc asset được liên kết.
