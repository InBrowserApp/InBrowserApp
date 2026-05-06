## What is an SSH public key fingerprint?

Vân tay khóa công khai SSH là một bản tóm lược ngắn của blob khóa công khai. Nó cung cấp cho bạn một giá trị gọn để so sánh trước khi tin cậy một khóa trong `authorized_keys`, kho kiểm kê máy chủ hoặc quy trình triển khai.

OpenSSH thường hiển thị vân tay SHA-256 như `SHA256:...`. Tài liệu cũ hơn và một số đợt kiểm tra vẫn dùng vân tay MD5 được phân tách bằng dấu hai chấm. Công cụ này hiển thị cả hai để bạn có thể đối chiếu đầu ra SSH hiện đại và bản ghi cũ mà không gửi khóa đi đâu.

Dán một khóa công khai, nhiều dòng `authorized_keys`, hoặc một khối khóa công khai SSH2. Bộ phân tích cú pháp bỏ qua chú thích và tùy chọn authorized_keys, đọc blob khóa SSH thật, rồi tính vân tay cục bộ trong trình duyệt của bạn.

- Xác minh khóa công khai đã sao chép khớp với vân tay do đồng đội chia sẻ.
- So sánh các mục `authorized_keys` với danh sách truy cập máy chủ.
- Kiểm tra loại khóa, kích thước khóa, đường cong và chú thích trước khi sao chép vân tay.
