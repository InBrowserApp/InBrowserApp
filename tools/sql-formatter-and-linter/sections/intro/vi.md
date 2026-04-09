## SQL Formatter & Linter là gì?

SQL Formatter & Linter định dạng lại các truy vấn SQL ngay trong trình duyệt và đồng thời kiểm tra chúng theo một bộ nhỏ các vấn đề có tín hiệu cao. Công cụ này hữu ích khi bạn muốn bố cục truy vấn gọn hơn, cách viết hoa từ khóa nhất quán và phản hồi nhanh về các mẫu rủi ro như `SELECT *` hoặc câu lệnh `UPDATE` không có mệnh đề `WHERE`.

## Khi Nào Nên Dùng

Dùng công cụ này khi bạn đang rà soát SQL viết tay, dọn lại các truy vấn đã dán trước khi chia sẻ, hoặc so sánh cách định dạng giữa các dialect SQL khác nhau. Công cụ hoạt động tốt cho việc rà soát truy vấn ad hoc, dọn dẹp pull request và định dạng chỉ trong trình duyệt mà không gửi SQL của bạn lên máy chủ.

## Công Cụ Kiểm Tra Gì

Bản viết lại này vẫn tách biệt nhưng phối hợp formatter và linter. Phần định dạng dùng `sql-formatter` với các tùy chọn bố cục theo dialect, còn phần lint hiển thị lỗi phân tích cú pháp, thiếu dấu chấm phẩy, việc dùng rộng `SELECT *`, các thay đổi dữ liệu không an toàn, dòng quá dài và sự lệch kiểu chữ của từ khóa.
