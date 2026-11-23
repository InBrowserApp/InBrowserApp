## Cách áp dụng JSON Patch

Dán tài liệu JSON gốc vào ô soạn thảo thứ nhất và mảng JSON Patch theo RFC 6902 vào ô thứ hai. Chọn **Áp dụng bản vá** để xem trước và sao chép JSON đã cập nhật. Để tạo bản vá, hãy so sánh tài liệu gốc và tài liệu đã sửa trong [So sánh JSON theo đường dẫn](../json-diff-path/), rồi sao chép kết quả **JSON Patch**. Dùng đúng tài liệu gốc đã dùng để tạo bản vá.

## Ví dụ về JSON Patch

Tài liệu gốc chứa một trạng thái và một thẻ.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Bản vá này kiểm tra trạng thái ban đầu, cập nhật trạng thái và thêm một thẻ vào cuối mảng.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Kết quả là `{"status":"published","tags":["api","release"]}`.

## Các thao tác được hỗ trợ và cú pháp JSON Pointer

- `add` tạo hoặc ghi đè một thuộc tính đối tượng, chèn một phần tử vào mảng hoặc thay thế tài liệu ở vị trí gốc.
- `remove` xóa một giá trị hiện có. `replace` thay một giá trị hiện có bằng giá trị mới.
- `move` lấy giá trị hiện có tại con trỏ `from` và chèn giá trị đó tại `path`. `copy` chèn một bản sao độc lập.
- `test` kiểm tra xem giá trị tại `path` có bằng `value` đã cung cấp hay không. Thao tác này giữ nguyên tài liệu.

Đường dẫn dùng JSON Pointer theo RFC 6901. Chỉ số mảng bắt đầu từ 0, vì vậy `/tags/0` trỏ đến thẻ đầu tiên. Khi thêm một giá trị vào mảng, `/tags/-` cho biết giá trị sẽ được thêm vào cuối mảng. Dùng `~1` cho dấu gạch chéo và `~0` cho dấu ngã trong khóa đối tượng. Ví dụ, `/a~1b` trỏ đến khóa `a/b`. Đường dẫn rỗng `""` trỏ đến toàn bộ tài liệu, còn `/` trỏ đến một thuộc tính có khóa là chuỗi rỗng.

## Vì sao một thao tác JSON Patch thất bại

Các thao tác chạy theo thứ tự trong mảng. Mỗi thao tác dùng kết quả của các thao tác trước đó. Nếu đích không tồn tại, chỉ số mảng vượt phạm vi hoặc giá trị của `test` không khớp, công cụ đánh dấu thao tác thất bại đầu tiên rồi dừng lại. Bản xem trước JSON chỉ xuất hiện khi toàn bộ bản vá được áp dụng thành công. Mảng bản vá rỗng `[]` trả về tài liệu gốc.

Bản vá được áp dụng ngay trong trình duyệt. JSON gốc và bản vá luôn nằm trong trình duyệt của bạn.
