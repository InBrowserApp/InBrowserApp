## So sánh CID của hai thư mục IPFS

Dán địa chỉ thư mục gốc vào ô **Thư mục ban đầu** và địa chỉ thư mục đã cập nhật vào ô **Thư mục cập nhật**, rồi chọn **So sánh thư mục**. Mỗi ô chấp nhận CID, địa chỉ `ipfs://` hoặc liên kết cổng truy cập HTTP. Thêm đường dẫn để so sánh hai thư mục con. Mở một kết quả để xem các CID, lọc danh sách theo đường dẫn hoặc chọn **Tải JSON xuống** để lưu kết quả so sánh.

## Thế nào là đường dẫn được thêm, xóa hoặc thay đổi?

Đường dẫn chỉ có trong một thư mục được đánh dấu là đã thêm hoặc đã xóa. Khi toàn bộ thư mục con được thêm hoặc xóa, công cụ hiển thị thư mục đó dưới dạng một đường dẫn. Nếu cả hai phiên bản đều có cùng một thư mục con với CID khác nhau, công cụ sẽ so sánh các đường dẫn bên trong. Danh sách mục đã thay đổi gồm các tệp hoặc liên kết tượng trưng có CID khác nhau giữa hai phiên bản và các đường dẫn có loại mục thay đổi. Tệp được nhập với cách chia phần hoặc mã hóa khác nhau có thể có CID khác nhau dù nội dung nhìn thấy giống hệt nhau.

## So sánh các phiên bản IPFS mà không cần tải từng tệp

Trình duyệt đọc các khối IPFS đã xác minh từ những cổng truy cập công cộng và bỏ qua các nhánh có CID trùng nhau. Nhờ đó bạn có thể so sánh các phiên bản của trang web, bộ dữ liệu đã công bố hoặc bản sao lưu thông qua địa chỉ thư mục bất biến của chúng. Công cụ so sánh được các liên kết đã thay đổi mà không cần tải toàn bộ tệp. Nếu không truy xuất được một mục trong thư mục, kết quả sẽ chỉ rõ đường dẫn không thể so sánh.

Tìm hiểu thêm về [định địa chỉ theo nội dung và các phiên bản bộ dữ liệu](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
