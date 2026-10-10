## Chuyển đổi sổ làm việc Excel sang OpenDocument

Mở hoặc thả tệp XLSX trên thiết bị, kiểm tra các ô và tải xuống sổ làm việc ODS. Tên và thứ tự trang tính, trang tính trống và ẩn, vị trí ô, văn bản, số, giá trị boolean, ngày tháng và kết quả công thức đã lưu đều được đưa vào. Cửa sổ xem trước không giới hạn dữ liệu được xuất. Trang tính ẩn hoàn toàn trở thành trang tính ẩn thông thường.

## Giá trị đã lưu và khả năng tương thích

Công thức được thay bằng giá trị đã lưu. Nếu thiếu kết quả đã lưu, ô sẽ để trống và có thông báo; trình duyệt không tính toán lại công thức hoặc làm mới dữ liệu bên ngoài. Kết quả lỗi bảng tính trở thành văn bản thuần. Mã định danh có số 0 ở đầu, ký tự ngoài bảng chữ cái Latinh và văn bản bắt đầu bằng dấu bằng vẫn là văn bản.

Ngày tháng tuân theo hệ thống ngày 1900 hoặc 1904 của sổ làm việc và sử dụng định dạng ngày/giờ tiêu chuẩn. Các giá trị chỉ có giờ và khoảng thời gian sử dụng định dạng khoảng thời gian cơ bản. Tỷ lệ phần trăm và giá trị tiền tệ giữ nguyên phần số, không giữ định dạng gốc hoặc nhãn tiền tệ. Ngày không có thật 29 tháng 2 năm 1900 của Excel và các định dạng ngày tùy chỉnh không được hỗ trợ sẽ tạo thông báo lỗi thay vì cho ra ngày bị lệch.

Kiểu định dạng, kích thước hàng và cột, bố cục ô gộp, biểu đồ, hình ảnh, nhận xét, liên kết, macro và thiết lập sổ làm việc không được tái hiện. Các giá trị được lưu trong vùng ô gộp vẫn nằm ở vị trí ô ban đầu. Trình chuyển đổi này chấp nhận XLSX, không chấp nhận XLS, XLSB hoặc XLSM. Tệp được mã hóa, tệp lưu trữ không hợp lệ, loại trang tính không được hỗ trợ và dữ liệu không thể biểu diễn bằng ODS sẽ tạo thông báo lỗi rõ ràng. Hãy kiểm tra các kết quả quan trọng trong ứng dụng bảng tính sau khi tải xuống.

## Xử lý trên thiết bị

Việc chuyển đổi diễn ra trong trình duyệt này mà không tải tài liệu lên. Thay hoặc đóng tệp sẽ loại bỏ kết quả tải xuống trước đó; hủy sẽ dừng tiến trình nền. Không có giới hạn cố định về kích thước tệp hoặc số lượng trang tính. Bộ nhớ trình duyệt có sẵn vẫn quyết định những sổ làm việc nào có thể được xử lý.

Để duyệt Excel và các định dạng bảng tính khác, hãy mở [Trình xem bảng tính](../xlsx-viewer/).
