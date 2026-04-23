## Data URI là gì?

Data URI (hoặc data URL) nhúng các tệp nhỏ trực tiếp vào văn bản. Định dạng: `data:[mime][;charset][;base64],data`.

**Cách dùng phổ biến:**

- Ảnh hoặc phông chữ inline trong HTML/CSS
- Lưu tài nguyên nhỏ trong JSON/cấu hình

**Lưu ý:**

- Phù hợp cho tệp nhỏ; chuỗi dài có thể làm chậm trang
- Base64 thường dùng cho dữ liệu nhị phân

### Ví dụ

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Phần đứng trước dấu phẩy mô tả tệp, chẳng hạn như kiểu MIME và việc có dùng Base64 hay không. Phần đứng sau dấu phẩy là dữ liệu đã được mã hóa.

### Khi nào nên dùng công cụ này

- Chuyển một tệp cục bộ thành chuỗi có thể nhúng vào HTML, CSS, JSON hoặc mẫu email
- Tạo nhanh một bản demo tự chứa mà không cần lưu trữ tài nguyên ở nơi khác
- Kiểm tra kiểu MIME được nhận diện trước khi dán kết quả vào công cụ khác

### Giới hạn thực tế

- Data URI phù hợp nhất với các tệp nhỏ như biểu tượng, ảnh nhỏ hoặc đoạn dữ liệu ngắn
- Base64 làm tăng kích thước khoảng 33%, nên chuỗi cuối cùng luôn lớn hơn tệp gốc
- Chuỗi quá dài có thể khó dán vào biểu mẫu, cấu hình hoặc trình soạn thảo có giới hạn kích thước
