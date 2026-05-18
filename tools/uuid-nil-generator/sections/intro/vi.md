## UUID nil là gì?

UUID nil là UUID theo tiêu chuẩn có toàn bộ 128 bit đều bằng không. Dạng văn bản chuẩn tắc của nó là `00000000-0000-0000-0000-000000000000`, và nó thường được dùng để biểu thị rằng "chưa có UUID nào được gán."

## Khi nào nên dùng

Dùng UUID nil khi API, cột cơ sở dữ liệu, fixture hoặc tệp cấu hình yêu cầu một giá trị có dạng UUID nhưng mã định danh thật cố ý vắng mặt. Nó hữu ích như một phần giữ chỗ trong kiểm thử, mẫu nhập dữ liệu, script migration và các giao thức định nghĩa rõ một giá trị UUID rỗng.

## Điều cần lưu ý

Đừng xem UUID nil là một mã định danh duy nhất được tạo ra. Nó luôn là cùng một giá trị, nên việc lưu nó ở nơi cần ID đối tượng thật có thể che giấu dữ liệu bị thiếu, phá vỡ giả định về tính duy nhất hoặc khiến các bản ghi trông như có liên kết dù thực tế không phải vậy.
