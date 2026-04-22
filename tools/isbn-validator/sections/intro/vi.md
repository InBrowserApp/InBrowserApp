## ISBN là gì?

ISBN (International Standard Book Number) là mã định danh cho sách và phiên bản.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Kiểm tra ISBN-10

ISBN-10 có 9 chữ số dữ liệu và một chữ số kiểm tra (X nghĩa là 10).

1. Loại bỏ dấu gạch ngang và khoảng trắng
2. Nhân với trọng số 10 đến 2 và cộng lại
3. Chữ số kiểm tra làm tổng chia hết cho 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Kiểm tra ISBN-13

ISBN-13 có 12 chữ số dữ liệu và một chữ số kiểm tra, thường bắt đầu bằng 978 hoặc 979.

1. Nhân xen kẽ với 1 và 3
2. Cộng 12 chữ số đầu tiên
3. Chữ số kiểm tra làm tổng là bội số của 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

ISBN-10 hợp lệ chuyển thành ISBN-13 với tiền tố 978; chỉ ISBN-13 có 978 mới chuyển ngược được.

`9780306406157` -> `0306406152`
