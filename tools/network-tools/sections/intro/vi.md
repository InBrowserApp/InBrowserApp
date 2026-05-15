Công cụ mạng là điểm bắt đầu cho các tác vụ mạng chạy trong trình duyệt. Dùng khi bạn biết loại vấn đề cần giải quyết nhưng muốn đi nhanh hơn tới đúng tiện ích: kiểm tra một dải IP, truy vấn bản ghi DNS, giải mã một miền quốc tế hóa, tra cứu cổng hoặc kiểm tra fingerprint của chứng chỉ hay khóa SSH.

## Bạn có thể làm gì

- Làm việc với IPv4, IPv6, khối CIDR, dải địa chỉ và địa chỉ link-local dẫn xuất từ MAC.
- Truy vấn bản ghi DNS và DNS ngược thông qua các công cụ tra cứu thân thiện với trình duyệt.
- Tra cứu mã trạng thái HTTP, MIME type, số cổng và thời gian mạng hiện tại.
- Kiểm tra chi tiết chứng chỉ và khóa công khai mà không gửi tài liệu nguồn lên máy chủ.

## Chọn đúng công cụ

Bắt đầu với **IP và CIDR** khi đầu vào là địa chỉ, dải, subnet hoặc khối định tuyến. Dùng **DNS và miền** cho bản ghi, tra cứu PTR và chuyển đổi IDN/Punycode. Dùng **Tham chiếu giao thức** khi bạn cần một bảng tra cứu nhanh. Dùng **Khóa và chứng chỉ** khi tài liệu nguồn là chứng chỉ TLS, khóa công khai hoặc mục khóa được ủy quyền SSH.

## Lưu ý về quyền riêng tư

Hầu hết công cụ trong bộ này chạy hoàn toàn trong trình duyệt của bạn. Các công cụ cần dữ liệu mạng công khai, chẳng hạn như tra cứu DNS hoặc thông tin IP, có thể liên hệ trình phân giải hoặc dịch vụ tra cứu cần thiết để trả lời truy vấn đó. Tránh dán bí mật vào các công cụ tra cứu công khai và ưu tiên công cụ chỉ chạy cục bộ để kiểm tra chứng chỉ và khóa khi tài liệu nhạy cảm.
