## Xuất notebook Jupyter đã lưu

Mở notebook IPYNB rồi chọn HTML, Markdown hoặc mã. HTML và Markdown giữ các ô theo thứ tự đã lưu, bao gồm đầu ra đã lưu được hỗ trợ. Mọi nội dung luôn ở trong trình duyệt của bạn. Không có kernel, mã hay môi trường thực thi tiện ích tương tác nào được khởi động.

## Chọn định dạng đầu ra phù hợp

HTML là bản sao độc lập để đọc, với văn bản có thể chọn, hình ảnh đi kèm được hỗ trợ và bảng đọc được. Markdown cung cấp nội dung tài liệu có thể tái sử dụng; bảng có thể chứa HTML an toàn và hình ảnh sử dụng URL dữ liệu nhúng mà một số ứng dụng Markdown không hiển thị. Bố cục và định dạng gốc có thể thay đổi.

Bản xuất mã giữ các ô mã theo thứ tự và bỏ qua Markdown, ô văn bản thô và đầu ra đã lưu. Ngôn ngữ notebook được nhận diện sẽ quyết định phần mở rộng của tệp tập lệnh; ngôn ngữ không xác định sử dụng TXT. Các lệnh magic của notebook và cú pháp shell được giữ nguyên như đã viết, nên mã đã xuất có thể cần điều chỉnh thủ công hoặc kernel gốc của notebook. Notebook không có ô mã sẽ tạo ra tệp mã trống.

## Kết quả đã lưu và khả năng tương thích

Trình chuyển đổi đọc notebook định dạng 4. Kết quả lấy từ tệp đã lưu và có thể đã lỗi thời. Nội dung có định dạng phong phú không được hỗ trợ và hình ảnh không có sẵn sẽ được báo. Tài nguyên từ xa không được tải về; tập lệnh, tiện ích tương tác, âm thanh và video không được chạy. LaTeX vẫn hiển thị dưới dạng văn bản nguồn, còn ô văn bản thô hoặc ô không xác định xuất hiện dưới dạng văn bản đọc được trong bản xuất tài liệu.

Tài nguyên trình duyệt quyết định giới hạn thực tế; không có hạn mức cố định về kích thước tệp hay số lượng ô. Để xem notebook gốc, hãy dùng [Trình xem notebook Jupyter](/tools/notebook-viewer/).
