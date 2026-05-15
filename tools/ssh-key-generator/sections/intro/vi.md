## Cặp khóa SSH là gì?

Cặp khóa SSH gồm một khóa công khai và một khóa riêng tư dùng để xác thực với máy chủ, máy chủ Git, hệ thống triển khai và các dịch vụ dựa trên SSH khác. Khóa công khai có thể được chia sẻ. Khóa riêng tư phải được giữ bí mật.

Trình tạo này tạo khóa Ed25519 hoặc RSA theo định dạng OpenSSH hoàn toàn trong trình duyệt của bạn. Công cụ cũng hiển thị dấu vân tay SHA-256, là giá trị ngắn gọn mà OpenSSH thường hiển thị khi bạn xác minh một khóa.

## Khi nào nên dùng công cụ này

- Tạo khóa phát triển cho máy chủ thử nghiệm, Git remote, container hoặc môi trường lab tạm thời.
- Tạo khóa Ed25519 khi bạn cần một mặc định hiện đại, gọn nhẹ cho quyền truy cập SSH mới.
- Tạo khóa RSA khi một dịch vụ cũ không hỗ trợ Ed25519.
- Sao chép khóa công khai vào `authorized_keys` trong khi vẫn giữ khóa riêng tư trên thiết bị của bạn.

## Cách chọn thuật toán

Ed25519 là mặc định tốt nhất cho hầu hết khóa SSH mới vì nó nhỏ, nhanh và được các phiên bản OpenSSH hiện nay hỗ trợ rộng rãi. RSA hữu ích để tương thích với thiết bị cũ, máy chủ Git cũ hoặc yêu cầu chính sách vẫn cần khóa RSA.

Đối với RSA, 4096 bit là mặc định thận trọng. Khóa 2048 bit nhỏ hơn tạo nhanh hơn và vẫn phổ biến, nhưng hiện nay nhiều nhóm ưu tiên 3072 hoặc 4096 bit cho khóa mới dùng lâu dài.

## Những điều cần lưu ý

- Khóa riêng tư được tạo ở đây chưa được mã hóa. Thêm cụm mật khẩu bằng `ssh-keygen -p -f <key-file>` nếu bạn cần.
- Lưu khóa riêng tư với quyền hạn chế, chẳng hạn như `chmod 600 <key-file>`.
- Không dán khóa riêng tư vào phiếu hỗ trợ, trò chuyện, nhật ký hoặc trang web không rõ nguồn gốc.
- Xoay vòng khóa khi máy tính xách tay, bí mật CI hoặc bản sao lưu chứa khóa riêng tư có thể đã bị lộ.
