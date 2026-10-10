## Xuất trang tính sang định dạng dễ trao đổi

Mở tệp .xlsx, .xlsm, .xltx hoặc .xltm trên thiết bị hoặc thả tệp vào trình xuất dữ liệu. Chọn trang tính theo tên gốc, bao gồm cả trang tính ẩn, rồi chọn CSV, TSV, JSON hoặc Markdown. Xem trước kết quả, sao chép hoặc tải xuống tệp UTF-8 được đặt tên theo sổ làm việc và trang tính. Thay hoặc đóng tệp sẽ hủy công việc chưa hoàn tất và xóa các bản tải xuống trước đó. Trình xem XLSX cũng cung cấp thao tác Xuất trang tính cho trang tính hiện tại.

Phạm vi ô mặc định là vùng hình chữ nhật nhỏ nhất chứa các giá trị hoặc công thức đã lưu. Các ô và hàng trống bên trong vùng đó vẫn được giữ trong kết quả. Bạn có thể nhập phạm vi khác, chẳng hạn A1:D20, rồi chọn Áp dụng phạm vi. Trang tính trống tạo ra tệp văn bản trống hoặc mảng JSON rỗng, trừ khi bạn chọn một phạm vi cụ thể.

## Chọn cách biểu diễn giá trị và hàng tiêu đề

Văn bản đã định dạng tuân theo các định dạng số được hỗ trợ, giữ cách hiển thị ngày tháng và định dạng số có số 0 ở đầu khi có thể. Các định dạng phụ thuộc vào thiết lập vùng có thể khác với Excel. Giá trị được lưu giữ nguyên số và giá trị boolean; ngày tháng vẫn là số sê-ri Excel và không được gán múi giờ. Các ô văn bản giữ nguyên nội dung ở cả hai chế độ. Công thức sử dụng kết quả đã lưu mà không tính toán lại. Kết quả chưa được lưu trở thành ô trống, kèm thông báo trong giao diện. Lỗi bảng tính vẫn là các chuỗi có thể đọc được, chẳng hạn #DIV/0!.

CSV và TSV đặt các trường chứa dấu phân cách, dấu ngoặc kép hoặc dấu xuống dòng trong dấu ngoặc kép. JSON là một mảng các mảng hàng: hàng đầu tiên vẫn nằm trong dữ liệu, tiêu đề trùng lặp hoặc trống không trở thành khóa đối tượng và ô trống sử dụng null. Markdown có thể coi hàng đầu tiên là hàng tiêu đề hoặc thêm một hàng tiêu đề trống phía trên tất cả các hàng dữ liệu. Dấu câu Markdown, HTML, dấu gạch đứng và dấu xuống dòng trong ô được thoát hoặc biểu diễn an toàn. Tệp tải xuống sử dụng UTF-8 không có dấu thứ tự byte; hãy chọn UTF-8 khi nhập vào ứng dụng khác.

## Xử lý trên thiết bị và khả năng tương thích

Sổ làm việc của bạn luôn ở trong trình duyệt này và không được công cụ tải lên hoặc lưu lại. Macro, tập lệnh và kết nối dữ liệu bên ngoài không được thực thi hoặc làm mới. Các hàng và cột ẩn được bao gồm trong phạm vi đã chọn. Ô gộp không được mở rộng thành các giá trị lặp lại. Biểu đồ, hình ảnh, nhận xét và kiểu định dạng của sổ làm việc không nằm trong các định dạng văn bản này.

Sổ làm việc được mã hóa, bị hỏng hoặc không được hỗ trợ sẽ có thông báo lỗi rõ ràng. Không có giới hạn cố định về kích thước tệp, số trang tính, số hàng hoặc số cột, nhưng việc xuất dữ liệu lớn có thể vượt quá bộ nhớ của trình duyệt. Công cụ xuất dữ liệu đã lưu; công cụ không chỉnh sửa sổ làm việc hoặc đảm bảo rằng ứng dụng bảng tính khác sẽ diễn giải các trường văn bản thuần túy theo cùng một cách.
