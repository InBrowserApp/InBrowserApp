## Cách nhận diện loại tệp

Công cụ đọc tối đa 64 KiB đầu tiên của tệp cục bộ và kiểm tra chữ ký nhị phân
bằng [file-type](https://github.com/sindresorhus/file-type). Kết quả gồm loại MIME
nhận diện được, các phần mở rộng dự kiến và bản xem trước 256 byte đầu tiên ở
dạng thập lục phân và ASCII. Không có dữ liệu nào được tải lên.

## Vì sao phần mở rộng có thể không khớp

Đổi tên tệp chỉ thay đổi tên, không thay đổi nội dung. Tệp PNG có tên photo.jpg
vẫn mang chữ ký PNG. Các phần mở rộng tương đương phổ biến như .jpg và .jpeg
đều được chấp nhận. MIME do trình duyệt báo cáo được hiển thị riêng vì giá trị
này thường dựa trên tên tệp thay vì kiểm tra các byte.

## Giới hạn nhận diện

Chữ ký chỉ là gợi ý, không phải bằng chứng rằng tệp hợp lệ hoặc an toàn. Các
định dạng văn bản như TXT, CSV và SVG có thể không được nhận diện. Mẫu ngắn có
thể xác định ZIP hoặc tệp chứa khác mà không xác nhận được định dạng con, chẳng
hạn tài liệu Office. Bản xem trước hex là nội dung thô của tệp, không phải tổng
kiểm tra mật mã.
