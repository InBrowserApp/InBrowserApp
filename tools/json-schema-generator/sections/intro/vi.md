## JSON Schema là gì?

JSON Schema là một tiêu chuẩn để mô tả cấu trúc dữ liệu JSON. Nó cho phép biểu diễn kiểu trường, cấu trúc lồng nhau, khóa bắt buộc và các ràng buộc hữu ích cho việc kiểm tra hợp lệ.

### Công cụ này làm gì

Dán JSON mẫu và công cụ sẽ suy ra schema ban đầu cho object, array, number, boolean, null và các định dạng chuỗi phổ biến. Kết quả có thể được sao chép, tải xuống và tinh chỉnh thêm.

### Ví dụ

Ví dụ, với dữ liệu mẫu sau:

**Đầu vào mẫu**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Schema được tạo**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Mẹo sử dụng

- Hãy dùng dữ liệu mẫu có tính đại diện, đặc biệt trong các mảng, để suy ra trường tùy chọn chính xác hơn.
- Tắt “Infer required properties” nếu dữ liệu đầu vào chỉ là một ví dụ chưa đầy đủ.
- Tắt “Allow additional properties” nếu bạn muốn schema nghiêm ngặt hơn theo mặc định.
- Giữ bật phát hiện định dạng chuỗi để suy ra email, URI, UUID và date-time.
