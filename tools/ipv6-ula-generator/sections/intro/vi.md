## Địa chỉ cục bộ duy nhất IPv6 là gì?

Địa chỉ cục bộ duy nhất (ULA) IPv6 được dùng để liên lạc bên trong các site, mạng riêng và tổ chức được kết nối. Toàn bộ không gian ULA là `fc00::/7`. Bit thứ tám là **bit L**: giá trị `1` chọn dải `fd00::/8` được cấp phát cục bộ mà trình tạo này sử dụng, còn nửa `fc00::/8` vẫn được dành riêng cho một phương thức cấp phát khác.

Theo mặc định, ULA không thể truy cập toàn cục, nhưng “cục bộ” không có nghĩa là bí mật hoặc tự động an toàn. Các địa chỉ này có thể đi qua ranh giới giữa các site được định tuyến, VPN và các kết nối riêng khi quản trị viên cấu hình những đường đi đó.

## Trình tạo RFC 4193 này xây dựng /48 như thế nào

Trình tạo RFC 4193 này yêu cầu chính xác 40 bit ngẫu nhiên từ Web Crypto API và kết hợp chúng với `fd`. Kết quả là một prefix site 48 bit duy nhất về mặt thống kê, chẳng hạn như `fd12:3456:789a::/48`. Quá trình tạo diễn ra trong trình duyệt: công cụ không thu thập địa chỉ MAC, dấu thời gian, mã định danh thiết bị hoặc phản hồi từ máy chủ.

Có `2^40` ID toàn cục khả dĩ — khoảng 1,1 nghìn tỷ. Nguồn ngẫu nhiên an toàn giúp giảm khả năng vô tình dùng trùng, nhưng không thể đảm bảo hai prefix được tạo độc lập sẽ không bao giờ xung đột. Hãy ghi `/48` đã chọn vào tài liệu mạng và tái sử dụng nó một cách nhất quán.

## Lập kế hoạch 65.536 subnet /64 khả dụng

Ngay sau prefix site `/48` là ID mạng con 16 bit. Các giá trị từ `0000` đến `ffff` tạo ra 65.536 mạng `/64` khả dĩ. Ví dụ, ID mạng con `00a0` biến `fd12:3456:789a::/48` thành mạng chuẩn `fd12:3456:789a:a0::/64`.

64 bit còn lại là ID giao diện. Công cụ này chỉ lập kế hoạch prefix mạng; công cụ không tạo địa chỉ host `/128` hay suy ra ID giao diện từ địa chỉ MAC.

## Nơi nên và không nên dùng ULA

ULA phù hợp với việc đánh địa chỉ nội bộ ổn định, các site kết nối qua VPN, mạng lab và các dịch vụ cần giữ prefix nội bộ trong khi vẫn dùng địa chỉ IPv6 unicast toàn cục. ULA không phải tường lửa hay ranh giới bảo mật vốn có. Hãy áp dụng kiểm soát truy cập thông thường, lọc lưu lượng ULA không phù hợp tại ranh giới site và không đưa bản ghi ULA nội bộ vào DNS công cộng.

Một host có thể đồng thời dùng ULA và địa chỉ unicast toàn cục. Dùng địa chỉ toàn cục để truy cập Internet và prefix ULA ổn định cho các tuyến riêng cần đến nó.
