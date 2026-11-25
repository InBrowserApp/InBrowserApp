## Cách chuẩn hóa văn bản Unicode

Nhập hoặc dán nội dung vào **Văn bản gốc**, sau đó chọn dạng chuẩn hóa. Kết quả tự cập nhật khi bạn nhập hoặc chuyển dạng. Chọn **Sao chép kết quả** để dùng văn bản đã chuẩn hóa trong ứng dụng khác. Quá trình chuyển đổi diễn ra ngay trong trình duyệt, còn nội dung bạn nhập vẫn nằm trên thiết bị.

## Nên chọn dạng chuẩn hóa Unicode nào?

- **NFC (kết hợp chính tắc)** là lựa chọn mặc định phù hợp cho văn bản thông thường. Nếu có sẵn ký tự mang dấu, NFC gộp chữ cái và dấu thành một điểm mã. Dùng NFC để thống nhất các cách biểu diễn tương đương trước khi lưu trữ hoặc so sánh văn bản.
- **NFD (phân rã chính tắc)** tách chuỗi thành các thành phần chính tắc, chẳng hạn chữ cái cơ sở và dấu kết hợp. Dùng NFD khi cần kiểm tra hoặc xử lý từng dấu riêng.
- **NFKC (kết hợp tương thích)** còn quy các biến thể tương thích, chẳng hạn chữ cái toàn chiều rộng và chữ ghép, về dạng thống nhất. Dạng này hữu ích khi tìm kiếm hoặc đối chiếu văn bản mà những khác biệt đó không quan trọng.
- **NFKD (phân rã tương thích)** áp dụng cùng các quy tắc tương thích nhưng giữ kết quả ở dạng phân rã, thuận tiện khi phân tích văn bản.

## Vì sao văn bản chuẩn hóa có thể trông y hệt bản gốc?

Chữ **é** có thể được lưu dưới dạng `U+00E9`, hoặc dưới dạng chữ **e** theo sau là dấu sắc kết hợp (`U+0065 U+0301`). NFC tạo ra cách biểu diễn thứ nhất, còn NFD tạo ra cách thứ hai. Mở **So sánh điểm mã** để xem dãy điểm mã ở đầu mỗi văn bản, kể cả khi hai bản trông giống hệt nhau.

Chọn **Thử ví dụ** để xem thêm những ký tự thay đổi rõ rệt. Với NFKC, **ＡＢＣ ① ﬁ** trở thành **ABC 1 fi**. NFC giữ nguyên sự khác biệt giữa các biến thể tương thích này.

## Khi nào việc chuẩn hóa có thể làm đổi ý nghĩa?

NFKC và NFKD có thể làm mất khác biệt về cách trình bày, chẳng hạn chỉ số trên trong công thức hoặc số có vòng tròn bao quanh trong danh sách. Hãy chọn NFC nếu cần giữ những khác biệt đó. Việc chuẩn hóa cũng khác với đổi chữ hoa, chữ thường, bỏ dấu hoặc chuyển giữa các bảng mã như UTF-8 và UTF-16.

Đọc thêm trong [phụ lục Tiêu chuẩn Unicode về các dạng chuẩn hóa](https://www.unicode.org/reports/tr15/).
