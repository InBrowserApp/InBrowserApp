## UUID v3 là gì?

UUID v3 là một định dạng UUID dựa trên tên. Nó nhận một namespace UUID và một
tên, băm chúng bằng MD5, rồi định dạng kết quả thành UUID tiêu chuẩn. Hành vi
quan trọng là tính xác định: cùng một namespace và tên luôn tạo ra cùng một
UUID.

Công cụ này chạy hoàn toàn trong trình duyệt của bạn. Namespace, tên và UUID đã
tạo vẫn ở trên thiết bị của bạn trừ khi bạn sao chép kết quả sang nơi khác.

## Khi nào nên dùng

- Dùng UUID v3 khi bạn cần một định danh ổn định cho một tên đã biết, chẳng hạn
  như tên DNS, URL, đường dẫn đối tượng hoặc tên người dùng.
- Chọn namespace khớp với loại tên bạn đang định danh. DNS và URL là các thiết
  lập sẵn phổ biến nhất.
- Tái sử dụng cùng một namespace một cách nhất quán. Thay đổi namespace sẽ thay
  đổi mọi UUID được tạo, ngay cả khi tên vẫn giữ nguyên.
- Ưu tiên UUID v5 hoặc một định danh hiện đại khác khi bạn có lựa chọn và cần
  UUID dựa trên tên với hàm băm mạnh hơn. UUID v3 tồn tại để tương thích với
  các hệ thống yêu cầu cụ thể UUID dựa trên MD5.

## Ghi chú về an toàn

UUID v3 không phải là ID ngẫu nhiên và không phải là bí mật. Bất kỳ ai biết
namespace và tên đều có thể tạo lại cùng một UUID. Không dùng nó cho mật khẩu,
token phiên, API key hoặc các giá trị khác cần phải không thể dự đoán.
