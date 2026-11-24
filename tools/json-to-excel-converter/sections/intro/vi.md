## Chuyển JSON thành bảng tính Excel

Dán một mảng JSON hoặc mở tệp `.json` trên thiết bị, kiểm tra bản xem trước bảng tính rồi chọn **Tải XLSX**. Trình chuyển đổi tạo một trang tính có hàng tiêu đề. Mỗi đối tượng trở thành một hàng; các trường xuất hiện ở bất kỳ đâu trong mảng trở thành các cột. Công cụ phù hợp với bản ghi API, danh sách sản phẩm và dữ liệu xuất. Nếu phản hồi API chứa các bản ghi trong một trường như `data`, hãy dán mảng bên trong trường đó.

## Mở rộng trường JSON lồng nhau thành cột

**Mở rộng trường lồng nhau** được bật theo mặc định. Ví dụ, hai bản ghi dưới đây tạo ra các cột `name`, `contact.city` và `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Khi tắt mở rộng, `contact` vẫn nằm trong một cột dưới dạng văn bản JSON như `{"city":"Oslo"}`. Mảng vẫn nằm trong một ô ở cả hai chế độ, nên `tags` không tạo thêm hàng. Trường bị thiếu hoặc có giá trị `null` sẽ hiển thị dưới dạng ô trống.

## Excel lưu giữ giá trị JSON như thế nào

Số và giá trị boolean thường trở thành số và giá trị logic trong Excel. Các số vượt quá độ chính xác hoặc phạm vi của Excel được giữ dưới dạng văn bản để bảo toàn các chữ số. Chuỗi JSON vẫn là văn bản, vì vậy ID như `"00123"`, ngày viết dưới dạng chuỗi và văn bản bắt đầu bằng `=` vẫn giữ nguyên ký tự.

## Xem trước và tải xuống trên thiết bị

Bản xem trước hiển thị phần đầu của trang tính. Tệp XLSX tải xuống chứa tất cả bản ghi và cột. Quá trình chuyển đổi chạy trong trình duyệt và JSON vẫn nằm trên thiết bị của bạn. Để xuất văn bản thuần túy, hãy dùng [Trình chuyển đổi JSON sang CSV](../json-to-csv-converter/).
