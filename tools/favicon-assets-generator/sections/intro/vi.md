## Công cụ này tạo ra những gì

Trình tạo này biến một hình ảnh duy nhất thành một bộ favicon hiện đại,
hoàn chỉnh — một tệp `.ico` đa kích thước cho các trình duyệt cũ, các biến
thể PNG 16 / 32 / 180 / 192 / 512, một tệp `.svg` gốc tùy chọn, một
`site.webmanifest` dành cho PWA, và đoạn HTML bạn dán vào `<head>`. Mọi
byte đều được tạo ra ngay trong trình duyệt của bạn; không tải lên, không
máy chủ, không phân tích dữ liệu.

## Những gì có trong bộ tệp

- `favicon.ico` — đa hình ảnh (16 / 32 / 48) dành cho thẻ trình duyệt,
  dấu trang, và các lối tắt Windows cũ.
- `favicon-16x16.png` và `favicon-32x32.png` — các biến thể PNG hiện đại
  được dùng bởi các trình duyệt hiện hành.
- `favicon.svg` — chỉ được kèm theo khi hình ảnh nguồn là SVG và công tắc
  "Use original SVG" được bật.
- `apple-touch-icon.png` — 180×180, không trong suốt, dùng cho màn hình
  chính iOS.
- `pwa-192x192.png` và `pwa-512x512.png` — các biểu tượng PWA tiêu chuẩn.
- `pwa-maskable-192x192.png` và `pwa-maskable-512x512.png` — các biến thể
  maskable với vùng an toàn được W3C khuyến nghị.
- `site.webmanifest` — tệp kê khai PWA đã được nối với các biểu tượng ở
  trên.

## Cách hoạt động của padding, nền và vùng an toàn maskable

Mỗi nền tảng có padding riêng ("Margin") để bạn có thể chừa khoảng trống
bên trong khung biểu tượng. Công tắc "Add background" sẽ vẽ một hình
vuông không trong suốt phía sau hình nguồn — hữu ích khi hình nguồn trong
suốt và đích đến yêu cầu có độ mờ đục (màn hình chính của Apple) hoặc chỉ
đơn giản để tạo độ tương phản thị giác trên thẻ trình duyệt. Biểu tượng
PWA maskable sử dụng thêm một vùng an toàn bên trên margin của nền tảng:
bất kỳ phần nào nằm ngoài khoảng ~80% trung tâm có thể bị cắt bởi
Android, Windows, hoặc ChromeOS khi chúng áp dụng mặt nạ hình tròn, bo
góc, hoặc squircle.

## Cách gắn bộ tệp vào trang web của bạn

1. Giải nén kho lưu trữ đã tải xuống vào thư mục gốc web của bạn (sao cho
   các tệp nằm tại `/favicon.ico`, `/site.webmanifest`, v.v.).
2. Dán đoạn HTML vào `<head>` của trang web.
3. Nếu bạn phục vụ tài nguyên từ một đường dẫn con (ví dụ
   `/static/icons/`), hãy đặt "Asset path" trước khi tạo để đoạn mã và
   tệp kê khai sử dụng đúng URL.
4. Nếu bạn đã tùy chỉnh tệp kê khai vượt ra ngoài những gì công cụ này
   cho phép (ví dụ thêm `categories` hoặc `screenshots`), hãy mở
   `site.webmanifest` trong một trình soạn thảo văn bản và chỉnh sửa
   trực tiếp — đó là JSON thuần.
