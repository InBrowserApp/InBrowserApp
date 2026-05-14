Tra cứu DNS kiểm tra các bản ghi DNS công khai được trả về cho một tên miền. Công cụ này hữu ích khi bạn xác minh việc ra mắt một trang web mới, gỡ lỗi việc gửi email, kiểm tra thay đổi CDN hoặc bộ cân bằng tải, hoặc xác nhận liệu các phản hồi liên quan đến DNSSEC có khác nhau giữa các bộ phân giải hay không.

## Khi nào nên dùng

Dùng công cụ này khi bạn cần câu trả lời nhanh ngay trong trình duyệt cho các loại bản ghi DNS phổ biến. Bản ghi A và AAAA cho biết đích IPv4 và IPv6, bản ghi CNAME cho biết bí danh, bản ghi MX xác định máy chủ trao đổi thư, bản ghi TXT thường chứa SPF hoặc mã xác minh, còn các bản ghi NS/SOA/CAA/SRV/HTTPS/SVCB cho thấy ủy quyền, thẩm quyền, chứng chỉ, dịch vụ và gợi ý điểm cuối hiện đại.

## Cách hoạt động

Việc tra cứu chạy trong trình duyệt của bạn bằng DNS over HTTPS. Chọn một bộ phân giải, chọn một hoặc nhiều loại bản ghi, rồi gửi miền hoặc URL. URL được chuẩn hóa thành hostname trước khi truy vấn được gửi, vì vậy khi dán `https://www.example.com/path`, công cụ sẽ truy vấn `www.example.com`.

## Đọc kết quả

Mỗi loại bản ghi được hiển thị riêng với mã phản hồi DNS, cờ của bộ phân giải, các dòng câu trả lời và JSON thô. `NoError` nghĩa là máy chủ DNS đã trả lời thành công, nhưng vẫn có thể không trả về dòng câu trả lời nào cho một loại cụ thể. `NXDomain`, `ServFail` hoặc `Refused` thường nghĩa là tên không tồn tại, bộ phân giải không thể hoàn tất tra cứu, hoặc chính sách của bộ phân giải đã chặn yêu cầu.

## Quyền riêng tư và giới hạn

Các truy vấn được gửi đến bộ phân giải DNS over HTTPS đã chọn, không gửi đến máy chủ InBrowser.App. Hành vi của bộ phân giải, trạng thái bộ nhớ đệm, xác thực DNSSEC và lọc mạng cục bộ đều có thể ảnh hưởng đến kết quả. Công cụ này không thay thế các kiểm tra `dig` có thẩm quyền từ nhiều mạng, nhưng là cách nhanh để xem các bộ phân giải DoH công khai trả về gì từ trình duyệt hiện tại của bạn.
