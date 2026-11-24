## Tính CID cho tệp hoặc thư mục

Chọn tệp hoặc thư mục trên thiết bị, rồi nhấn **Tính CID**. Sao chép mã định danh nội dung (CID) để ghi vào bản kê hoặc đối chiếu với lần nhập IPFS trước đó. Trình duyệt thực hiện phép tính ngay trên thiết bị của bạn, giữ nguyên các tệp tại đó và không đăng chúng lên IPFS.

## Vì sao cùng một tệp có thể có nhiều CID IPFS?

IPFS có thể chia một tệp thành các khối và dùng UnixFS để lưu liên kết giữa các khối. CID gốc phụ thuộc vào cách chia, mã hóa và sắp xếp chúng. Để tái tạo CID, hãy dùng cùng kích thước phần chia, thiết lập khối lá dạng thô và cấu trúc thư mục như lần nhập ban đầu. CID của thư mục còn phụ thuộc vào tên của các mục bên trong. Trình chọn thư mục của trình duyệt bỏ qua các thư mục con trống.

## Tái tạo CID bằng Kubo

Mở **Thiết lập nhập** để đổi phiên bản CID, kích thước phần chia, chế độ khối lá dạng thô hoặc cách bọc trong thư mục. CIDv1 là phiên bản mặc định. Chọn CIDv0 khi đối chiếu với một lần nhập cũ đã dùng phiên bản này. **Bọc trong thư mục** thêm một thư mục ngoài để bạn có thể truy cập tệp theo tên bên dưới CID gốc.

Sao chép lệnh `ipfs add --only-hash` hiển thị trên trang để tính lại CID cho cùng tệp hoặc thư mục bằng Kubo. Nếu có CID từ lần nhập trước, hãy dán vào ô so sánh. CIDv0 và CIDv1 tương đương sẽ khớp vì chúng cùng định danh một khối. [Tài liệu IPFS về mã định danh nội dung](https://docs.ipfs.tech/concepts/content-addressing/)
