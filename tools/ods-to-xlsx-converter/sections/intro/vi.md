## Chuyển đổi bảng tính OpenDocument sang Excel

Mở hoặc thả tệp ODS trên thiết bị, kiểm tra các ô và tải xuống sổ làm việc XLSX. Tên và thứ tự trang tính, trang tính ẩn, văn bản, số, giá trị boolean, ngày tháng, kết quả công thức đã lưu và ô gộp đều được đưa vào. Trang tính trống và khoảng trống giữa các ô được giữ lại. Cửa sổ xem trước không giới hạn dữ liệu được xuất.

## Giá trị đã lưu và khả năng tương thích

Công thức được thay bằng giá trị đã lưu, không phải công thức Excel. Nếu thiếu kết quả đã lưu, ô sẽ để trống và có thông báo. Trình duyệt không tính toán lại công thức hoặc làm mới dữ liệu bên ngoài. Kết quả lỗi trở thành lỗi bảng tính chung. Văn bản thuần vẫn là văn bản, bao gồm mã định danh có số 0 ở đầu, ký tự ngoài bảng chữ cái Latinh và văn bản bắt đầu bằng dấu bằng.

Ngày tháng sử dụng định dạng ngày/giờ tiêu chuẩn; các giá trị có múi giờ được chỉ định rõ sẽ được quy đổi về UTC. Khoảng thời gian vẫn là số ngày và tỷ lệ phần trăm sử dụng định dạng phần trăm cơ bản. Giá trị tiền tệ giữ nguyên phần số, không giữ nhãn tiền tệ hoặc định dạng gốc. Kiểu định dạng, kích thước hàng và cột, biểu đồ, hình ảnh, nhận xét, liên kết, macro và thiết lập sổ làm việc không được tái hiện.

Tệp được mã hóa, tệp lưu trữ không hợp lệ, dữ liệu không được hỗ trợ và giá trị hoặc tên trang tính nằm ngoài giới hạn Excel hỗ trợ sẽ tạo thông báo lỗi rõ ràng. Trình chuyển đổi này không chấp nhận tệp OpenDocument dạng phẳng (.fods). Hãy kiểm tra các kết quả quan trọng trong ứng dụng bảng tính sau khi tải xuống.

## Xử lý trên thiết bị

Việc chuyển đổi diễn ra trong trình duyệt này mà không tải tài liệu lên. Thay hoặc đóng tệp sẽ loại bỏ kết quả tải xuống trước đó; hủy sẽ dừng tiến trình nền. Không có giới hạn cố định về kích thước tệp hoặc số lượng trang tính. Bộ nhớ trình duyệt có sẵn vẫn quyết định những sổ làm việc nào có thể được xử lý.

Để duyệt ODS và các định dạng bảng tính khác, hãy mở [Trình xem bảng tính](../xlsx-viewer/).
