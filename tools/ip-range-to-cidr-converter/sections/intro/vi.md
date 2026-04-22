## Công cụ này làm gì

Công cụ này chuyển đổi địa chỉ IP bắt đầu và địa chỉ IP kết thúc thành tập hợp khối CIDR nhỏ nhất bao phủ chính xác toàn bộ phạm vi. Mọi thứ đều chạy cục bộ trong trình duyệt của bạn nên địa chỉ sẽ không bao giờ rời khỏi thiết bị của bạn.

## Cách thức hoạt động của CIDR Covering

Khối CIDR đại diện cho một mạng có kích thước lũy thừa hai được căn chỉnh trên một ranh giới phù hợp. Khi một phạm vi bắt đầu hoặc kết thúc ở giữa các ranh giới đó thì một khối là không đủ. Bộ chuyển đổi tiếp tục lấy khối căn chỉnh lớn nhất phù hợp, sau đó lặp lại cho đến khi bao phủ toàn bộ phạm vi.

## Tại sao nhiều khối có thể xuất hiện

Các phạm vi như 192.168.1.10 đến 192.168.1.25 không bắt đầu trên một ranh giới mạng sạch và cũng không kết thúc trên một ranh giới mạng. Do đó, kết quả chính xác là một danh sách ngắn các khối, mỗi khối bao gồm một phần được căn chỉnh mà không bao gồm các địa chỉ bổ sung ngoài phạm vi được yêu cầu.

## Khi điều này hữu ích

Sử dụng nó khi chuẩn bị các quy tắc tường lửa, tóm tắt tuyến đường, mục nhập ACL, nhóm bảo mật đám mây hoặc danh sách kiểm tra di chuyển trong đó phạm vi bắt đầu và kết thúc thô cần phải trở thành ký hiệu CIDR tiêu chuẩn.
