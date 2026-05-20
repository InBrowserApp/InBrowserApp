## Công cụ này làm gì

Trình tách PDF cho phép bạn mở một PDF trong trình duyệt, chọn trang theo phạm
vi hoặc theo số trang, rồi tạo một tài liệu nhỏ hơn. Bạn có thể trích xuất các
trang đã chọn vào một PDF, tách từng phạm vi đã nhập thành một PDF riêng, hoặc
tách từng trang đã chọn thành tệp riêng và tải kết quả xuống dưới dạng kho lưu
trữ ZIP.

## Trường hợp sử dụng phù hợp

- Lấy một vài trang từ hợp đồng, báo cáo, sổ tay hoặc bản quét dài trước khi
  chia sẻ với người khác.
- Tách chương, hóa đơn, biểu mẫu hoặc các phần đính kèm thành từng tệp PDF
  riêng.
- Loại bỏ các trang bạn không cần trước khi gửi tài liệu đến tiệm in, bộ phận
  hỗ trợ hoặc quy trình phê duyệt.
- Tạo các lần tách có thể lặp lại bằng cú pháp phạm vi như `1-3,5,8-10` thay
  vì nhấp thủ công vào từng trang.

## Cách hoạt động của phạm vi trang

Dùng các số trang và phạm vi bao gồm cả hai đầu, phân tách bằng dấu phẩy.
`1-3,5,8-10` chọn các trang 1, 2, 3, 5, 8, 9 và 10. Một trang chỉ có thể xuất
hiện một lần trong biểu thức, và các phạm vi giảm dần như `7-4` sẽ bị từ chối
để thứ tự đầu ra luôn rõ ràng và dễ đoán.

Với đầu ra là một PDF duy nhất, các trang đã chọn được sao chép vào một tài liệu
mới theo thứ tự hiển thị trong biểu thức phạm vi. Với nhiều PDF đầu ra, “một tệp
cho mỗi phạm vi” giữ từng đoạn đã nhập cùng nhau, còn “một tệp cho mỗi trang”
tạo một PDF riêng cho từng trang đã chọn.

## Ghi chú về quyền riêng tư

PDF được xử lý cục bộ trong trình duyệt của bạn và không được công cụ này tải
lên. Các liên kết tải xuống đã tạo là URL đối tượng tạm thời chỉ tồn tại trong
tab hiện tại. Hãy xem lại các tệp kết quả trước khi chia sẻ, vì các trang được
sao chép vẫn có thể chứa siêu dữ liệu nhúng, chú thích, giá trị biểu mẫu hoặc
nội dung ẩn từ tài liệu gốc.

## Hạn chế

PDF được mã hóa, được bảo vệ bằng mật khẩu hoặc bị hỏng có thể không mở được
trong thư viện PDF phía trình duyệt. Trình tách này sao chép các trang vào PDF
mới, nhưng đây không phải là công cụ che xóa trực quan và không bảo
đảm loại bỏ toàn bộ siêu dữ liệu của tài liệu. Để che xóa pháp lý, sửa khả năng
truy cập hoặc tối ưu hóa nâng cao, hãy dùng một trình chỉnh sửa PDF chuyên dụng
sau khi tách.
