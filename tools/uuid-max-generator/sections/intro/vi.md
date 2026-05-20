## Max UUID Là Gì?

Max UUID là UUID theo chuẩn có toàn bộ 128 bit được đặt thành một. Dạng văn bản chuẩn của nó là `ffffffff-ffff-ffff-ffff-ffffffffffff`, và nó thường được dùng để biểu thị giá trị UUID cao nhất có thể.

## Khi Nào Nên Dùng

Dùng max UUID khi một API, truy vấn cơ sở dữ liệu, fixture hoặc kiểm tra phạm vi cần một giới hạn trên hoặc giá trị sentinel có hình dạng UUID. Nó hữu ích trong kiểm thử, script di trú, con trỏ phân trang và các giao thức định nghĩa rõ một giá trị UUID tối đa.

## Điều Cần Lưu Ý

Không xem max UUID là một định danh duy nhất được tạo ra. Nó luôn là cùng một giá trị, nên việc lưu nó ở nơi cần ID đối tượng thật có thể che khuất logic sentinel, phá vỡ giả định về tính duy nhất hoặc khiến bản ghi bất ngờ được sắp xếp xuống cuối.
