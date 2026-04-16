## Xác Thực Thẻ Tín Dụng là gì?

Xác thực thẻ tín dụng là quy trình kiểm tra xem số thẻ có khả năng hợp lệ trước khi xử lý giao dịch. Nó sử dụng thuật toán Luhn và nhận dạng thương hiệu thẻ để xác minh định dạng.

### Thuật toán Luhn

Thuật toán Luhn (còn được gọi là Mod 10) là công thức checksum được sử dụng để xác thực số nhận dạng. Đây là cách nó hoạt động:

1. Bắt đầu từ chữ số ngoài cùng bên phải, nhân đôi mỗi chữ số thứ hai
2. Nếu nhân đôi ra số lớn hơn 9, trừ 9 khỏi kết quả
3. Cộng tất cả các chữ số. Nếu tổng chia hết cho 10, số hợp lệ

### Thương Hiệu Thẻ Được Hỗ Trợ

Thương hiệu thẻ được xác định bởi BIN (Số Nhận Dạng Ngân Hàng) hoặc IIN (Số Nhận Dạng Tổ Chức Phát Hành), là các chữ số đầu tiên của số thẻ.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
