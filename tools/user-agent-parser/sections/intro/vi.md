## User-Agent là gì?

Chuỗi User-Agent (UA) xác định trình duyệt hoặc ứng dụng gửi yêu cầu và thường bao gồm thông tin về trình duyệt, hệ điều hành, thiết bị và engine. Vì có thể bị giả mạo, hãy coi đây là gợi ý chứ không phải tín hiệu bảo mật.

### Trình phân tích này hiển thị gì

Công cụ này phân tích chuỗi UA được dán ngay trong trình duyệt của bạn và nhóm kết quả theo trình duyệt, hệ điều hành, engine, thiết bị, CPU và đầu ra JSON. Không có dữ liệu nào được tải lên.

### Ví dụ

Hãy dán một chuỗi Chrome trên Windows phổ biến như sau:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

Kết quả sẽ nhận diện Chrome 115 trên Windows 10 cùng engine Blink và kiến trúc CPU amd64.

### Lưu ý quan trọng

Các trình duyệt hiện đại ngày càng dựa vào Client Hints, vì vậy một chuỗi UA được sao chép có thể không cho thấy toàn bộ thông tin mà website nhận được trong một yêu cầu thực.
