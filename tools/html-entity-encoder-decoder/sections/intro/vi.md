## Công cụ này làm gì

- Mã hóa văn bản thường thành HTML entity dạng tên, thập phân hoặc thập lục
  phân.
- Giải mã các đoạn đã được entity hóa về lại văn bản dễ đọc.
- Mọi thứ chạy cục bộ trong trình duyệt, nên dữ liệu của bạn không rời khỏi
  thiết bị.

## Khi nào nên dùng

- Escape ký tự đặc biệt trước khi dán HTML vào tài liệu, mẫu hoặc bản demo.
- Kiểm tra đoạn markup đã sao chép có chứa `&amp;`, `&#60;` hoặc `&#x3C;`.
- So sánh entity dạng tên, thập phân và thập lục phân cho nhu cầu tương thích.

## Lưu ý về các định dạng entity

- Entity dạng tên dễ đọc nhất, nhưng không phải ký tự nào cũng có tên tương
  ứng.
- Entity thập phân và thập lục phân có thể biểu diễn mọi ký tự Unicode, kể cả
  emoji.
- Entity không hợp lệ hoặc không được nhận diện sẽ được giữ nguyên khi giải mã.
