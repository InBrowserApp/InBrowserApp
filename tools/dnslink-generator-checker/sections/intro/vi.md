## Tạo bản ghi TXT DNSLink cho IPFS

DNSLink trỏ tên miền hoặc tên miền phụ đến một đường dẫn nội dung. Nhập tên miền rồi dán CID IPFS, đường dẫn IPFS hoặc đường dẫn IPNS. Sao chép **Tên** và **Giá trị TXT** vừa tạo vào bản ghi TXT mới tại nhà cung cấp DNS. Ví dụ, miền `www.example.com` dùng tên bản ghi `_dnslink.www.example.com`. Nếu trình chỉnh sửa DNS tự động nối thêm `example.com`, hãy nhập `_dnslink.www` vào ô tên.

## Kiểm tra DNSLink đang trỏ tới đâu

Chọn **Kiểm tra bản ghi đã công bố** để xem kết quả TXT từ Cloudflare và Google. Để trống ô đích nếu chỉ muốn tra cứu thiết lập hiện tại, hoặc nhập đích mong muốn để đối chiếu với giá trị đã công bố. Sau khi bạn thay đổi bản ghi, các bộ phân giải vẫn có thể trả về giá trị cũ cho đến khi bộ nhớ đệm hết hạn. TTL hiển thị cho biết một câu trả lời DNS nhận được có thể lưu trong bộ nhớ đệm bao lâu.

## Cập nhật trang web IPFS dùng tên miền riêng

Dùng CID IPFS để trỏ trực tiếp đến một phiên bản cố định của tệp, hoặc dùng đường dẫn IPNS để trỏ đến một tên có thể cập nhật. DNSLink cho ứng dụng khách và cổng truy cập tương thích biết cần phân giải đến nội dung nào. Để phục vụ nội dung qua tên miền HTTPS của riêng bạn, hãy thiết lập một cổng truy cập hỗ trợ DNSLink và trỏ tên miền tới cổng đó. [Tên miền riêng trên IPFS và DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
