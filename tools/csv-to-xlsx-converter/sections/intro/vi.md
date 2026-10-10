## Chuyển đổi văn bản có dấu phân cách sang Excel

Mở hoặc thả tệp CSV hay TSV trên thiết bị, kiểm tra các ô và tải xuống sổ làm việc XLSX có một trang tính tên Sheet1. Chọn dấu phân cách và mã hóa văn bản nếu nhận diện tự động không phù hợp với tệp. Tệp TSV dùng ký tự tab theo mặc định. Cửa sổ xem trước không giới hạn dữ liệu được xuất.

## Giữ mã định danh và văn bản gốc

CSV và TSV không lưu kiểu dữ liệu của ô bảng tính. Trình chuyển đổi này giữ mọi trường ở dạng văn bản, bao gồm số 0 ở đầu, mã định danh dài, giá trị có dạng số thập phân, ngày tháng và văn bản bắt đầu bằng dấu bằng. Công cụ không tự động suy đoán số hay ngày tháng và không thực thi công thức. Dấu phân cách nằm trong dấu ngoặc kép, dấu ngoặc kép được thoát, Unicode, dấu xuống dòng trong trường, trường trống và bản ghi trống đều được giữ lại. Các hàng có ít trường hơn để trống các ô còn lại. Dấu xuống dòng cuối tệp kết thúc bản ghi cuối cùng thay vì thêm một hàng nữa.

Thiết lập hàng đầu tiên cho phép chọn dữ liệu thông thường hoặc hàng tiêu đề có bộ lọc Excel. Cả hai đều giữ nguyên hàng như đã viết, bao gồm tiêu đề trùng lặp hoặc trống. Chế độ mã hóa tự động hỗ trợ UTF-8 và UTF-16 có dấu thứ tự byte. Có thể chọn các mã hóa khác theo cách thủ công. Chỉ thị sep= ở đầu tệp chỉ được bỏ qua khi chọn nhận diện dấu phân cách tự động hoặc khi dấu phân cách trong chỉ thị khớp với dấu phân cách đã chọn.

Các trường có dấu ngoặc kép sai định dạng, mã hóa văn bản không hợp lệ và dữ liệu vượt quá giới hạn của Excel về hàng, cột hoặc văn bản trong ô sẽ tạo thông báo lỗi thay vì sổ làm việc bị cắt bớt. Hãy kiểm tra các giá trị quan trọng trong ứng dụng bảng tính sau khi tải xuống.

## Xử lý trên thiết bị

Việc chuyển đổi diễn ra trong trình duyệt này mà không tải tệp lên. Thay đổi thiết lập nhập, thay hoặc đóng tệp sẽ loại bỏ kết quả trước đó. Hủy sẽ dừng tiến trình nền. Không có giới hạn cố định về kích thước tệp; bộ nhớ trình duyệt có sẵn quyết định những tệp nào có thể được xử lý.

Để duyệt các tệp bảng tính, hãy mở [Trình xem bảng tính](../xlsx-viewer/).
