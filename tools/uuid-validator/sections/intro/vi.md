## Trình xác thực UUID là gì?

Trình xác thực UUID kiểm tra xem một mã định danh có được viết theo dạng UUID 36 ký tự tiêu chuẩn, chẳng hạn như `6ba7b810-9dad-11d1-80b4-00c04fd430c8`, hay không. Công cụ này hữu ích khi bạn cần kiểm tra các ID được sao chép từ nhật ký, API, cơ sở dữ liệu, fixture kiểm thử hoặc dữ liệu người dùng nhập trước khi dựa vào chúng trong mã.

### Đầu vào được hỗ trợ

Công cụ này xác thực văn bản UUID chuẩn với năm nhóm thập lục phân theo bố cục `8-4-4-4-12`. Chữ hoa được chấp nhận và được chuẩn hóa thành chữ thường. Nil UUID (`00000000-0000-0000-0000-000000000000`) và max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) được xem là các giá trị đặc biệt hợp lệ.

### Chi tiết xác thực

Đối với UUID tiêu chuẩn, trình xác thực kiểm tra nibble phiên bản và các bit biến thể. Các phiên bản từ 1 đến 8 được nhận diện, bao gồm UUID RFC 4122 cũ và các bố cục RFC 9562 mới hơn như UUID v6, v7 và v8. Bảng kết quả cũng tách UUID thành năm đoạn để bạn có thể kiểm tra chính xác các byte đang được xác thực.

### Quyền riêng tư

Quá trình xác thực chạy hoàn toàn trong trình duyệt của bạn. UUID bạn dán vào không được tải lên, vì vậy công cụ này an toàn để dùng với mã định danh nội bộ, khóa cơ sở dữ liệu và mẫu nhật ký production cần được giữ cục bộ.
