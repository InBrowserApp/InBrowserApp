## Công cụ này tra cứu những gì

Tra cứu thông tin IP phân giải địa chỉ IPv4, địa chỉ IPv6, tên miền hoặc URL và hiển thị siêu dữ liệu công khai mà các dịch vụ internet có thể báo cáo cho từng địa chỉ. Công cụ này hữu ích khi bạn cần kiểm tra một tên miền đang trỏ đến đâu, mạng nào sở hữu một địa chỉ, hostname DNS ngược nào tồn tại, hoặc bản ghi IPv4 và IPv6 có dẫn đến các nhà cung cấp khác nhau hay không.

## Cách tra cứu tên miền và URL hoạt động

Khi bạn nhập tên miền hoặc URL, công cụ trích xuất hostname và truy vấn trình phân giải DNS-over-HTTPS đã chọn để lấy cả bản ghi A và AAAA. Sau đó, từng địa chỉ được trả về sẽ được bổ sung thông tin riêng, nên các tên miền dual-stack có thể hiển thị quốc gia, ASN, ISP, hostname hoặc múi giờ khác nhau cho IPv4 và IPv6.

## Ý nghĩa của kết quả

Các trường vị trí và ISP đến từ những nhà cung cấp siêu dữ liệu IP công khai như geojs.io và ip.sb, còn hostname đến từ tra cứu PTR DNS ngược khi có. Những bản ghi này mô tả cách các cơ sở dữ liệu công khai nhìn thấy địa chỉ, không phải vị trí vật lý chính xác của một người hoặc thiết bị.

## Ghi chú về quyền riêng tư và độ chính xác

Việc tra cứu chạy trong trình duyệt của bạn và gửi yêu cầu DNS cùng siêu dữ liệu IP đến các dịch vụ bên thứ ba. VPN, proxy, CDN, mạng di động và nền tảng đám mây có thể khiến vị trí hoặc tổ chức được báo cáo khác với người dùng cuối hoặc máy chủ mà bạn kỳ vọng. Các trường trống là bình thường đối với địa chỉ riêng tư, địa chỉ dành riêng, địa chỉ mới được cấp phát hoặc ít được ghi nhận.
