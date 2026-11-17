## Kiểm tra tệp Parquet trong trình duyệt

Mở hoặc thả tệp `.parquet` để duyệt dữ liệu và kiểm tra kiểu vật lý, chú thích logic cùng thuộc tính lặp của từng trường. Các nhóm lồng nhau vẫn hiển thị trong lược đồ. Phần tóm tắt cho biết số hàng, số cột, nhóm hàng, phương thức nén và công cụ tạo tệp nếu có. Bạn có thể thử tệp mẫu đi kèm mà không cần chọn tệp.

## Duyệt dữ liệu và xuất CSV hoặc JSON

Dữ liệu được tải từng trang một. Dùng các nút phân trang để di chuyển trong tệp và chọn một ô để đọc toàn bộ giá trị. Chuyển sang **Lược đồ** để kiểm tra các trường. Dùng **Xuất dữ liệu** để tải xuống trang hiện tại hoặc tất cả các hàng dưới dạng CSV UTF-8 hoặc mảng JSON. Việc xuất toàn bộ tệp được chuẩn bị theo từng lô và có thể hủy.

CSV bao gồm tên cột và đặt các giá trị chứa dấu phẩy, dấu ngoặc kép hoặc ký tự xuống dòng trong dấu ngoặc kép. Giá trị null trở thành ô CSV trống và vẫn là `null` trong JSON. Giá trị lồng nhau dùng JSON; dữ liệu nhị phân dùng văn bản thập lục phân. Để bảo toàn số nguyên 64 bit, JSON ghi chúng dưới dạng chuỗi. Ngày và dấu thời gian dùng văn bản ISO với độ chính xác đến mili giây. Số thập phân tuân theo độ chính xác số của trình đọc, vì vậy trình xem này không phải công cụ chuyển đổi không mất dữ liệu cho số thập phân hoặc dấu thời gian có độ chính xác cao.

## Xử lý cục bộ

Tệp được đọc cục bộ trong một worker chạy nền và không bao giờ được tải lên. Trình xem đọc siêu dữ liệu ở cuối tệp trước, sau đó chỉ đọc các phạm vi hàng cần thiết để duyệt. Tuy nhiên, việc giải mã các nhóm hàng Parquet vẫn có thể cần nhiều bộ nhớ; kích thước xuất bị giới hạn bởi bộ nhớ khả dụng của trình duyệt. hyparquet và gói nén của nó hỗ trợ dữ liệu không nén cùng các codec Snappy, Gzip, Brotli, Zstandard và LZ4. Tệp Parquet được mã hóa không được hỗ trợ.
