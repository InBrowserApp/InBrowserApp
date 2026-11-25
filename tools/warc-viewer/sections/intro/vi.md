## Mở tệp lưu trữ web WARC

Chọn hoặc thả tệp `.warc` hoặc `.warc.gz`. Bạn cũng có thể thử tệp lưu trữ mẫu. Trình xem lập danh sách các bản ghi thu thập rồi mở trang HTML đầu tiên tìm được trong tệp. Hãy lọc theo URL hoặc loại bản ghi để tìm mục cần xem, sau đó chuyển giữa phần xem trước trang và chi tiết bản ghi. Tệp lưu trữ lớn có thể mất một lúc để lập chỉ mục. Tệp được xử lý ngay trong trình duyệt.

## Xem thời điểm thu thập và tiêu đề

Tệp Web ARChive (WARC) lưu lại các bản ghi mà trình thu thập dữ liệu hoặc công cụ lưu trữ tạo ra khi truy cập trang web. Cùng một URL có thể có nhiều bản ghi. Bạn có thể phân biệt chúng theo thời điểm thu thập (UTC) và trạng thái HTTP lúc đó. Bản ghi phản hồi chứa nội dung máy chủ gửi về, còn bản ghi yêu cầu mô tả nội dung trình thu thập đã gửi đi. Bản ghi truy cập lại có thể tham chiếu đến một lần thu thập khác để tránh lưu lại cùng một trang. Bạn vẫn có thể kiểm tra những bản ghi này khi không có trang để xem trước.

## Phần xem trước hiển thị những gì?

Phần xem trước tĩnh lấy HTML, hình ảnh và bảng định kiểu được hỗ trợ từ chính tệp lưu trữ. Nếu thiếu tài nguyên, bố cục có thể thay đổi hoặc xuất hiện khoảng trống. Trình xem không chạy tập lệnh và không gửi yêu cầu đến trang web gốc, nên các chức năng tương tác như đăng nhập và phát video không hoạt động. Trình xem hỗ trợ WARC 1.0 và 1.1, bao gồm cả các bản ghi nén bằng gzip.

[Đặc tả định dạng WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
