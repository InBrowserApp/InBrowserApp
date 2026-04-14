## Unicode Escaping là gì?

Unicode escaping chuyển đổi các ký tự thành các chuỗi mã hóa đại diện cho điểm mã Unicode của chúng. Điều này rất cần thiết khi mã nguồn, tệp cấu hình hoặc định dạng dữ liệu không thể chứa trực tiếp một số ký tự nhất định.

**Các định dạng escape phổ biến:**

- `\uXXXX` — JavaScript / JSON, được sử dụng trong hầu hết các ngôn ngữ lập trình
- `\u{XXXXX}` — ES6+ JavaScript, hỗ trợ các ký tự bổ sung mà không cần cặp đại diện (surrogate pairs)
- `&#xXXXX;` / `&#DDDD;` — Thực thể HTML ở dạng thập lục phân hoặc thập phân
- `U+XXXX` — Ký hiệu Unicode chuẩn được sử dụng trong tài liệu
- `\xXX` / `%XX` — Mã hóa cấp byte UTF-8, phổ biến trong URL và các ngôn ngữ kiểu C
- `\UXXXXXXXX` — Định dạng 8 chữ số của Python cho bất kỳ điểm mã nào
- `0xXXXX` — Ký hiệu hex literal

## Khi nào nên sử dụng công cụ này

- Nhúng các ký tự không phải ASCII vào mã nguồn hoặc tệp cấu hình yêu cầu mã hóa an toàn ASCII
- Gỡ lỗi văn bản bị lỗi bằng cách kiểm tra các điểm mã Unicode bên dưới
- Chuyển đổi giữa các ký hiệu escape khác nhau khi chuyển đổi giữa các ngôn ngữ hoặc định dạng
- Chuẩn bị văn bản cho các ngữ cảnh JSON, HTML hoặc URL cần các ký tự được mã hóa thực thể

## Cách hoạt động

Nhập hoặc dán văn bản thuần ở bên trái và công cụ sẽ escape các ký tự không phải ASCII bằng định dạng đã chọn. Dán văn bản đã escape ở bên phải và công cụ sẽ tự động phát hiện và giải mã tất cả các định dạng được hỗ trợ cùng lúc. Mọi thứ đều chạy cục bộ trong trình duyệt.
