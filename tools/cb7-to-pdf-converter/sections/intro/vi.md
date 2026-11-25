## Cách chuyển CB7 sang PDF

Chọn tệp truyện `.cb7` hoặc kéo thả vào trình chuyển đổi. Bạn cũng có thể dùng tệp nén `.7z` chứa ảnh các trang truyện. Mỗi ảnh sẽ thành một trang PDF. Kiểm tra bản xem trước rồi chọn **Tải xuống PDF**. Ví dụ, `volume-01.cb7` sẽ thành `volume-01.pdf`.

## Thứ tự trang, chất lượng hình ảnh và tìm kiếm lời thoại

CB7 lưu các trang truyện tranh trong tệp nén 7z. Công cụ sắp xếp theo đường dẫn đầy đủ, gồm cả tên thư mục và tên tệp. Số trong tên được xếp theo giá trị, nên `chapter2/page2.jpg` đứng trước `chapter2/page10.jpg`. Trang dọc và trang đôi khổ ngang giữ nguyên tỷ lệ và kích thước tính bằng pixel. Công cụ hỗ trợ JPEG, PNG, GIF, WebP, BMP và AVIF nếu trình duyệt đọc được AVIF.

Chữ vẫn là một phần của hình vẽ. Để tìm kiếm lời thoại, hãy mở PDF đã tạo bằng [OCR PDF](../pdf-ocr/) và chọn ngôn ngữ của truyện.

## Xử lý tệp nén lớn hoặc được bảo vệ

Quá trình chuyển đổi diễn ra trên thiết bị của bạn và hiển thị trang đang xử lý. Trong tệp 7z lớn dùng chế độ nén liền khối (solid), nhiều ảnh nằm trong cùng một khối nén, nên việc đọc từng trang có thể mất nhiều thời gian hơn. Chọn **Hủy chuyển đổi** để dừng và chọn tệp khác. Với tệp nén có mật khẩu hoặc chia thành nhiều phần, hãy giải nén trước rồi đóng gói ảnh thành một tệp nén duy nhất có thể mở được. Dùng [Trình đọc truyện tranh CB7](../cb7-reader/) để xem bản gốc, hoặc [Trình chuyển đổi CBZ sang PDF](../cbz-to-pdf-converter/) cho truyện nén dưới dạng ZIP.
