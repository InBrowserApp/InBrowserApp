## ID cư trú của Trung Quốc là gì?

Số ID cư trú Trung Quốc gồm 18 ký tự, bao gồm mã địa chỉ, ngày sinh, mã thứ tự và chữ số kiểm tra. Trình xác thực này kiểm tra các phần đó ngoại tuyến và giúp bạn hiểu cấu trúc của số.

### Cách quá trình xác thực hoạt động

- Loại bỏ khoảng trắng và dấu gạch nối, đồng thời chuẩn hóa ký tự cuối thành `X` viết hoa
- Yêu cầu đúng 18 ký tự: 17 chữ số và ký tự cuối là chữ số hoặc `X`
- Đối chiếu 6 chữ số đầu với bộ dữ liệu phân chia hành chính năm 2023 và phân tích ngày sinh 8 chữ số
- Tính lại chữ số kiểm tra từ 17 chữ số đầu và so sánh với ký tự cuối

### Kết quả hiển thị gì

- Phân rã khu vực: tỉnh, thành phố, quận/huyện và mã khu vực gốc
- Ngày sinh, tuổi hiện tại, mã thứ tự và giới tính suy ra từ mã thứ tự
- ID đã chuẩn hóa cùng với chữ số kiểm tra kỳ vọng và thực tế để dễ đối chiếu

### Ví dụ

`110101199001010015` có thể được đọc như sau:

- `110101` -> quận Đông Thành, Bắc Kinh
- `19900101` -> ngày sinh `1990-01-01`
- `001` -> mã thứ tự
- `5` -> chữ số kiểm tra

### Lưu ý quan trọng

Công cụ này chỉ thực hiện kiểm tra cấu trúc và checksum ở chế độ ngoại tuyến. Một số vượt qua các bước kiểm tra này không chứng minh đó là danh tính thật hoặc giấy tờ hiện vẫn còn hiệu lực.

Tên khu vực dựa trên bộ dữ liệu phân chia hành chính năm 2023.
