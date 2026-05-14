Công cụ này chuyển một địa chỉ IPv4 hoặc IPv6 thành tên DNS ngược của nó và
truy vấn bản ghi `PTR` tương ứng. Công cụ giúp bạn kiểm tra tên máy chủ mà chủ
sở hữu địa chỉ công bố cho máy chủ thư, thiết bị mạng, phiên bản đám mây và ghi
chú xử lý sự cố.

## Nội dung công cụ kiểm tra

Với IPv4, công cụ đảo thứ tự các octet và truy vấn tên `in-addr.arpa`. Với IPv6,
công cụ mở rộng địa chỉ thành 32 nibble hệ thập lục phân, đảo ngược chúng, rồi
truy vấn tên `ip6.arpa` tương ứng. Kết quả hiển thị tên miền DNS ngược chính
xác, mã trạng thái DNS, trình phân giải, họ địa chỉ và mọi tên máy chủ được trả
về cùng giá trị TTL.

## Cách truy vấn chạy

Tra cứu chạy từ trình duyệt của bạn bằng DNS-over-HTTPS. Bạn có thể chọn
Cloudflare, Google hoặc AliDNS làm trình phân giải, và trình duyệt gửi truy vấn
`PTR` tiêu chuẩn tới điểm cuối đó. Không có dịch vụ tra cứu phía máy chủ nào của
InBrowser.App tham gia.

## Cách đọc khi thiếu kết quả

Việc thiếu câu trả lời PTR là bình thường. Nhiều địa chỉ dân dụng, đám mây,
riêng tư hoặc mới được cấp không công bố bản ghi DNS ngược. Phản hồi DNS thành
công nhưng không có tên máy chủ không chứng minh địa chỉ chưa được sử dụng; nó
chỉ có nghĩa là vùng ngược không trả về bản ghi `PTR` khả dụng thông qua trình
phân giải đã chọn.

## Ghi chú thực tế

- DNS ngược ánh xạ địa chỉ IP tới tên máy chủ; nó khác với việc tìm mọi tên miền
  được lưu trữ trên cùng địa chỉ.
- Bản ghi PTR do chủ sở hữu địa chỉ IP hoặc nhà cung cấp upstream kiểm soát, chứ
  không chỉ do riêng chủ sở hữu tên miền.
- Hệ thống thư và bảo mật thường so sánh DNS xuôi và DNS ngược, nên bản ghi PTR
  thường nên trỏ tới một tên máy chủ phân giải trở lại cùng địa chỉ.
