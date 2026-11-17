## Tập con phông chữ là gì?

Tập con phông chữ chứa các ký tự cần thiết cho một đoạn văn bản cụ thể,
cùng các hình chữ bổ trợ cần để hiển thị chúng. Loại bỏ các hình chữ không
dùng có thể giảm đáng kể dung lượng phông chữ tải xuống, đặc biệt với phông
tiếng Trung, tiếng Nhật và tiếng Hàn có dung lượng lớn hoặc với tiêu đề,
biểu trưng hay trang chiến dịch có nội dung cố định.

## Cách sử dụng công cụ này

Chọn tệp TTF, OTF, WOFF hoặc WOFF2 rồi dán toàn bộ văn bản sẽ dùng phông chữ đó.
Chọn WOFF2 để phân phối trên web hoặc TTF / OTF cho phông chữ không nén, rồi tạo
tập con. So sánh dung lượng, kiểm tra bản xem trước và tải phông chữ cùng CSS
tương ứng. Việc xử lý phông chữ diễn ra cục bộ trong một Web Worker.

## Những gì được giữ lại?

HarfBuzz giữ lại các quan hệ phụ thuộc giữa hình chữ và các tính năng dàn chữ
OpenType cần cho chữ ghép, điều chỉnh khoảng cách cặp chữ, dấu kết hợp và các
hệ chữ viết phức tạp. Hinting và các trục của phông chữ biến đổi được giữ lại.
Các dạng văn bản tổ hợp và phân rã tương đương chuẩn tắc cũng được đưa vào nếu
phông chữ nguồn hỗ trợ. Bản xem trước dùng phông chữ đã tạo, còn các ký tự
không có trong phông chữ nguồn được liệt kê riêng.

## Mẹo thực tế

- Bao gồm khoảng trắng, dấu câu, chữ số và mọi chuỗi đã dịch mà bạn cần.
  Thêm bộ ký tự Latin có sẵn nếu văn bản cũng chứa các ký tự Latin cơ bản.
- Tạo lại tập con mỗi khi văn bản thay đổi. Tập con cố định phù hợp nhất với
  nội dung đã biết; hãy dùng phạm vi ký tự rộng hơn cho văn bản do người dùng tạo.
- Việc tạo tập con không thể thêm các ký tự thiếu trong phông chữ gốc. Hãy giữ
  phông chữ dự phòng trong CSS cho các ký tự ngoài tập con.
- Sử dụng phông chữ có giấy phép cho phép chỉnh sửa và nhúng trên web. Các bộ
  sưu tập phông chữ (`.ttc` / `.otc`) phải được xuất thành từng phông chữ riêng trước.
- Phông chữ nhỏ hoặc đã được tạo tập con có thể không giảm thêm dung lượng.
  WOFF2 thường cho dung lượng tải xuống nhỏ nhất trên web; số lượng hình chữ
  cũng bao gồm các hình chữ bổ trợ.
