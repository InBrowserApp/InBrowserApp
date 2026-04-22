## VIN là gì?

Mã số nhận dạng xe (VIN) là một mã gồm 17 ký tự dùng để nhận dạng duy nhất một phương tiện.

- `1M8GDM9AXKP042788`
- Các chữ cái I, O, Q không được sử dụng
- Ký tự thứ 9 là chữ số kiểm tra

### Cấu trúc VIN

1. **WMI** (vị trí 1-3): Mã nhận dạng nhà sản xuất thế giới
2. **VDS** (vị trí 4-8): Phần mô tả xe
3. **Chữ số kiểm tra** (vị trí 9): được tính từ tất cả các ký tự khác
4. **VIS** (vị trí 10-17): Phần nhận dạng xe

### Chữ số kiểm tra

Mỗi chữ cái được chuyển đổi thành một số (A=1, B=2, ... bỏ qua I, O, Q). Mỗi vị trí có một trọng số. Tổng có trọng số chia lấy dư cho 11 cho ra chữ số kiểm tra; giá trị 10 được biểu diễn bằng X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = chữ số kiểm tra`

Công cụ này chỉ xác thực định dạng và quy tắc chữ số kiểm tra. Nó không xác minh thông tin đăng ký thực tế.
