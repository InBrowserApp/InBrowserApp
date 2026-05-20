Tạo mã định danh UUID v5 từ UUID không gian tên và một tên mà không gửi bất kỳ giá trị nào đến máy chủ. UUID v5 hữu ích khi bạn cần một mã định danh ổn định có thể được tạo lại sau này từ cùng dữ liệu đầu vào, chẳng hạn như ID cho tên miền, URL, đường dẫn đối tượng, tên tài khoản hoặc bản ghi fixture.

## Cách UUID v5 Hoạt Động

UUID v5 kết hợp một UUID không gian tên với chuỗi tên, băm các byte đó bằng SHA-1, rồi áp dụng các bit phiên bản và biến thể của RFC 4122. Vì đầu vào có tính xác định, `example.com` trong không gian tên DNS luôn tạo ra cùng một UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Chọn Một Không Gian Tên

Dùng `ns:DNS` cho tên miền, `ns:URL` cho URL, `ns:OID` cho mã định danh đối tượng và `ns:X.500 DN` cho tên phân biệt X.500. Bạn cũng có thể dán UUID không gian tên riêng khi ứng dụng của bạn cần các mã định danh được giới hạn trong phạm vi sản phẩm, tenant, tập dữ liệu hoặc quá trình di chuyển dữ liệu.

## Khi Nào Nên Dùng

Chọn UUID v5 khi khả năng tái tạo quan trọng hơn tính ngẫu nhiên. Công cụ này phù hợp cho các thao tác nhập có tính xác định, fixture kiểm thử, bản ghi có không gian tên và các hệ thống cần cùng một mục logic nhận cùng một ID qua nhiều lần chạy. Với token bí mật hoặc ID công khai không thể dự đoán, hãy dùng trình tạo ngẫu nhiên thay thế.
