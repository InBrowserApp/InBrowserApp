## Công cụ này chuyển đổi gì

Bộ chuyển đổi này xem UUID đúng như giá trị 128-bit vốn có và giữ các dạng biểu
diễn phổ biến luôn đồng bộ. Dán một UUID, giá trị Base64, chuỗi thập lục phân,
số nguyên thập phân, giá trị bát phân hoặc giá trị nhị phân, rồi các định dạng
khác sẽ được cập nhật cục bộ trong trình duyệt của bạn.

## Cách đọc các định dạng

Trường UUID hiển thị dạng chuẩn có dấu gạch nối. Thập lục phân là cùng 16 byte
đó dưới dạng 32 chữ số hex chữ thường. Base64 là Base64 chuẩn có đệm cho 16 byte
thô, không phải Base64 cho các ký tự văn bản của UUID. Thập phân, bát phân và
nhị phân hiển thị UUID như một số nguyên 128-bit không dấu; đầu ra nhị phân được
đệm bên trái đủ 128 bit để các số không đứng đầu vẫn hiển thị.

## Điều cần lưu ý

Các giá trị nằm ngoài phạm vi UUID 128-bit sẽ bị từ chối. Đầu vào Base64 phải
giải mã được đúng 16 byte. Bộ chuyển đổi chấp nhận những biến thể thường gặp khi
dán như UUID chữ hoa, tiền tố `urn:uuid:`, dấu ngoặc nhọn, UUID 32 ký tự hex rút
gọn, khoảng trắng quanh các giá trị số dài và Base64 an toàn cho URL. Không có
gì được tải lên khi bạn chuyển đổi hoặc tạo UUID mẫu.
