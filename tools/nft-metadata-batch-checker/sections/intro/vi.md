## Kiểm tra JSON siêu dữ liệu NFT trước khi mint

Chọn **Tệp trên thiết bị** để kiểm tra từng tệp JSON hoặc cả thư mục bộ sưu tập. Bạn có thể chọn trực tiếp tệp có tên dạng số như `1` hoặc `42`. Công cụ báo JSON không hợp lệ và các lỗi siêu dữ liệu thường gặp ở từng mục, như tên trống, thiếu ảnh, mô tả không hợp lệ hoặc thuộc tính sai định dạng. Dùng **Cần xem lại** để tìm các mục cần sửa, hoặc chọn **Tải JSON xuống** để lưu toàn bộ báo cáo.

## Kiểm tra hàng loạt URI token

Trong mục **URI token**, dán mỗi địa chỉ siêu dữ liệu trên một dòng. Với bộ sưu tập có ID đánh số, dùng **Mẫu URI** với một phần giữ chỗ như `https://example.com/metadata/{id}.json`. Đặt ID đầu và ID cuối để kiểm tra cả dãy, bao gồm hai đầu. Dạng thập phân dùng ID như đã nhập. **Thập lục phân ERC-1155** biểu diễn mỗi ID bằng 64 ký tự thập lục phân viết thường, thêm số 0 ở đầu theo quy tắc thay thế `{id}` của ERC-1155. Công cụ cũng thay thế `{id}` trong các giá trị siêu dữ liệu như liên kết ảnh.

## Kiểm tra liên kết ảnh và hoạt ảnh của NFT

Bật **Kiểm tra khả năng truy cập nội dung đa phương tiện** để kiểm tra các liên kết `image` và `animation_url`. Chọn cả thư mục trên thiết bị để kiểm tra nội dung được tham chiếu bằng đường dẫn tương đối. Đường dẫn bắt đầu bằng `/` được phân giải từ gốc của thư mục đã chọn. Trình duyệt cũng có thể kiểm tra tài nguyên HTTP, IPFS và Arweave. Lỗi cổng truy cập, hết thời gian chờ hoặc hạn chế truy cập khác nguồn có thể khiến một số liên kết chưa được xác nhận. Hãy kiểm tra lại các liên kết đó trên cổng truy cập hoặc sàn bạn dùng. Tệp trên thiết bị được kiểm tra trong trình duyệt. Khi kiểm tra URI, trình duyệt kết nối đến máy chủ hoặc cổng truy cập tương ứng.

Xem định nghĩa các trường và quy tắc thay thế trong URI token tại [hướng dẫn siêu dữ liệu OpenSea](https://docs.opensea.io/docs/metadata-standards) và [đặc tả siêu dữ liệu ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
