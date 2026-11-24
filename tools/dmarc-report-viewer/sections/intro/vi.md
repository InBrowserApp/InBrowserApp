## Cách đọc báo cáo tổng hợp DMARC

Mở tệp đính kèm của báo cáo tổng hợp được gửi đến địa chỉ `rua` trong bản ghi DMARC của bạn. Trình xem hỗ trợ XML, GZIP và ZIP chứa một báo cáo XML. Bạn cũng có thể dán XML hoặc tải ví dụ. Phần tóm tắt cho biết tổ chức gửi báo cáo, kỳ báo cáo theo UTC và chính sách mà tên miền đã công bố. Tệp và văn bản đã dán được xử lý ngay trong trình duyệt.

## Cách đọc số lượng thư

Mỗi bản ghi theo nguồn gửi gom các thư có cùng IP nguồn và kết quả đánh giá. Một bản ghi có thể chứa nhiều thư, và cùng một IP có thể xuất hiện trong nhiều bản ghi. Tổng số được tính bằng cách cộng số thư ở từng dòng. Thư đạt DMARC khi SPF hoặc DKIM xác thực thành công và miền tương ứng khớp với tên miền trong trường From hiển thị. Trình xem chỉ tính một thư là không đạt khi cả hai kết quả đối chiếu miền đều không đạt. Nếu thiếu dữ liệu đối chiếu, kết quả được hiển thị là không xác định.

## Tại sao kết quả đối chiếu miền, xác thực và cách xử lý có thể khác nhau

Mở phần Kết quả xác thực gốc để xem các tên miền, kết quả và bộ chọn DKIM được ghi trong báo cáo. SPF hoặc DKIM có thể xác thực thành công cho một tên miền khác trong khi kết quả đối chiếu miền của DMARC vẫn không đạt. Cách xử lý đã áp dụng cho biết máy chủ nhận đã xử lý nhóm thư như thế nào. Cách xử lý có thể khác với chính sách đã công bố nếu phía nhận áp dụng ngoại lệ. Lọc theo IP nguồn hoặc tên miền From để kiểm tra một nguồn gửi mà vẫn giữ nguyên số liệu tổng thể.

## Các định dạng XML của DMARC được hỗ trợ

Trình xem đọc được báo cáo tổng hợp theo RFC 9990, bao gồm không gian tên DMARC của chuẩn này, và báo cáo cũ dựa trên RFC 7489. RFC 9990 mô tả định dạng XML dùng để tóm tắt kết quả xác thực và cách xử lý thư trong báo cáo tổng hợp. Nếu hệ thống thư đóng gói nhiều báo cáo trong một tệp nén, hãy giải nén báo cáo cần xem rồi mở riêng.
