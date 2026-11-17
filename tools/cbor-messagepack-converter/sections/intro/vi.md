## Kiểm tra dữ liệu nhị phân của API

CBOR và MessagePack là các định dạng tuần tự hóa nhị phân nhỏ gọn cho dữ liệu có cấu trúc. Dùng trình chuyển đổi này để xem phản hồi API, thông điệp WebSocket hoặc giá trị được lưu trong bộ nhớ đệm dưới dạng JSON, hoặc tạo dữ liệu nhị phân từ JSON để gỡ lỗi. Mọi dữ liệu đều được xử lý trong trình duyệt; dữ liệu đầu vào không được tải lên hay lưu lại.

## Mã hóa JSON hoặc giải mã byte

Chọn định dạng nhị phân và chiều chuyển đổi. Để mã hóa, nhập JSON và chọn Hex, Base64 hoặc Base64URL cho đầu ra. Để giải mã, dán các byte và chọn cách mã hóa đầu vào. Việc thay đổi cách mã hóa đầu vào sẽ diễn giải lại văn bản đang có trong trình chỉnh sửa.

Mở tệp JSON khi mã hóa, hoặc tệp thô `.cbor`, `.msgpack` hay `.bin` khi giải mã. Văn bản đã mã hóa như Hex hoặc Base64 cần được dán vào trình chỉnh sửa. Chuyển đổi, rồi sao chép văn bản hiển thị hoặc tải kết quả xuống. Tệp nhị phân tải xuống chứa các byte thực và có thể được nhập lại.

## Bảo toàn giá trị và hiểu các giới hạn

Các giá trị số nguyên viết trực tiếp giữ nguyên mọi chữ số trong phạm vi 64 bit mà định dạng hỗ trợ. Những giá trị JSON không thể biểu diễn, như trường nhị phân, thẻ CBOR và phần mở rộng MessagePack, xuất hiện dưới dạng các đối tượng bao có kiểu rõ ràng. Bật JSON mở rộng để mã hóa các đối tượng bao này trở lại dạng nhị phân; tắt tùy chọn này đối với các đối tượng JSON thông thường vô tình dùng khóa bao.

Ví dụ, khi bật JSON mở rộng, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` mã hóa một số nguyên chính xác và hai byte nhị phân.

Mỗi lần chuyển đổi xử lý một giá trị, với giới hạn đầu vào là 1 MiB. Bộ đếm Byte JSON đã định dạng tính kích thước JSON được định dạng dễ đọc đang hiển thị, thay vì dữ liệu đầu vào ban đầu. Mã hóa lại bảo toàn các giá trị được hỗ trợ nhưng có thể thay đổi thứ tự ánh xạ hoặc cách mã hóa nhị phân. Mở “Định dạng và bảo toàn kiểu dữ liệu” ở trên để xem cú pháp đối tượng bao và các kiểu không được hỗ trợ.
