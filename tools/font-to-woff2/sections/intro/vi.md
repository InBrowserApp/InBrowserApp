## Cách chuyển TTF hoặc OTF sang WOFF2

Chọn một hoặc nhiều tệp phông chữ TrueType (`.ttf`) hoặc OpenType (`.otf`), hoặc kéo thả chúng vào vùng chuyển đổi. Quá trình chuyển đổi bắt đầu ngay khi bạn thêm tệp. Khi phông chữ đã sẵn sàng, hãy so sánh dung lượng của tệp gốc và tệp WOFF2 rồi chọn **Tải WOFF2**. Ví dụ, `Inter-Regular.ttf` được chuyển thành `Inter-Regular.woff2`. Mọi bước xử lý đều diễn ra trong trình duyệt, nên các tệp vẫn nằm trên thiết bị của bạn.

## Vì sao nên dùng WOFF2 cho phông chữ web?

WOFF2 (Web Open Font Format 2) dùng Brotli để nén dữ liệu phông chữ. Khi dùng WOFF2 thay cho tệp TTF hoặc OTF gốc, trang web thường cần truyền ít dữ liệu hơn. Dung lượng giảm được tùy vào từng phông. Quá trình chuyển đổi giữ nguyên toàn bộ hình chữ và các trục biến thiên, nên một tệp phông chữ biến đổi vẫn có thể hỗ trợ nhiều độ đậm. Nếu trang web chỉ dùng một số ký tự nhất định, hãy dùng [trình tạo tập con phông chữ](../font-subset-generator/) để giảm dung lượng thêm.

## Cách dùng tệp WOFF2 trong CSS

Đặt tệp đã tải xuống vào thư mục phông chữ của trang web rồi khai báo bằng `@font-face`. Chọn đường dẫn, độ đậm và kiểu chữ phù hợp với tệp thực tế. Ví dụ dưới đây tải phông chữ có độ đậm thông thường từ thư mục `/fonts/` và hiển thị văn bản bằng phông dự phòng trong lúc tải.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Với phông chữ biến đổi, hãy dùng dải độ đậm mà phông hỗ trợ, ví dụ `font-weight: 100 900;`. Kiểm tra giấy phép trước khi lưu trữ phông chữ trên trang web và thử hiển thị các ngôn ngữ cùng độ đậm mà trang sử dụng. Xem thêm [tài liệu @font-face trên MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
