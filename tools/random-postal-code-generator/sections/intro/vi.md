## Tạo mã bưu chính để kiểm thử

Chọn quốc gia hoặc khu vực, nhập số lượng rồi chọn **Tạo**. Bạn có thể sao chép cả danh sách hoặc tải xuống tệp văn bản UTF-8, mỗi dòng một mã bưu chính. Dùng kết quả để điền biểu mẫu kiểm thử, tạo dữ liệu mẫu hoặc kiểm tra cách biểu mẫu thanh toán và đăng ký hiển thị mã bưu chính địa phương.

## So sánh các định dạng mã bưu chính

Mã bưu chính có thể chứa chữ cái, khoảng trắng, dấu gạch nối hoặc số 0 ở đầu. Mã ZIP của Hoa Kỳ có thể có dạng `02108`, còn ZIP+4 có thêm dấu gạch nối và bốn chữ số, chẳng hạn `02108-1234`. Mã bưu chính của Vương quốc Anh có thể có dạng `SW1 2AB`, của Canada là `K1A 0B1`, của Nhật Bản là `100-0001`, còn mã CEP của Brazil có thể có dạng `01001-000`. Quốc gia hoặc khu vực bạn chọn quyết định định dạng kết quả, độc lập với ngôn ngữ của trang.

Khi nhập kết quả vào bảng tính hoặc cơ sở dữ liệu, hãy lưu mã bưu chính dưới dạng văn bản. Nhập `02108` dưới dạng số sẽ làm mất số 0 ở đầu và thay đổi giá trị.

## Tôi có thể dùng kết quả để gửi thư không?

Faker.js tạo mã mẫu theo định dạng đã chọn. Một mã có thể trùng với mã của khu vực phát thư thực tế. Khi gửi thư, hãy tra cứu mã bưu chính theo địa chỉ thực tế với đơn vị bưu chính phụ trách.
