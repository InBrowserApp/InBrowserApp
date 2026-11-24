## Tính Piece CID cho tệp lưu trữ CAR hoặc tệp khác

Chọn đúng tệp bạn định gửi cho nhà cung cấp dịch vụ lưu trữ Filecoin. Chọn **Tính Piece CID**, rồi sao chép mã định danh theo định dạng hệ thống của bạn yêu cầu. Công cụ cũng hiển thị kích thước piece sau khi đệm, tính bằng byte. Trình duyệt đọc tệp ngay trên thiết bị và xử lý theo từng phần, nên nội dung vẫn nằm trên thiết bị của bạn.

## Nên dùng định dạng nào?

**Piece CID (v2)** tuân theo [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Mã này thường bắt đầu bằng `bafkzci` và chứa thông tin kích thước dữ liệu mà các công cụ Filecoin mới cần. **CommP phiên bản cũ (v1)** thường bắt đầu bằng `baga6ea4` và được dùng trong các thỏa thuận lưu trữ Filecoin truyền thống. Nếu hệ thống yêu cầu Piece CID phiên bản cũ và kích thước piece sau khi đệm, hãy sao chép giá trị cam kết phiên bản cũ và dùng kích thước hiển thị kèm theo. Bạn có thể dán mã ở một trong hai định dạng để kiểm tra giá trị cam kết có khớp với tệp hay không. CommP phiên bản cũ có thể cho cùng một giá trị với các tệp chỉ khác nhau về số byte 0 ở cuối.

## Vì sao CID IPFS của tôi trông khác?

CID gốc của IPFS định danh một khối hoặc gốc của tệp hay thư mục. Piece CID Filecoin là giá trị cam kết cho chính xác chuỗi byte của dữ liệu lưu trữ sau khi áp dụng quy tắc đệm và băm của Filecoin. Nếu dữ liệu cần lưu là tệp CAR, hãy tính giá trị cam kết từ chính tệp lưu trữ đó. Hai tệp CAR có thể có cùng CID gốc IPFS nhưng lưu các khối theo thứ tự khác nhau, khiến Piece CID thay đổi. Khi gửi thỏa thuận lưu trữ, hãy dùng đúng tệp mà bạn đã dùng để tính.

Xem định dạng và quy tắc đệm trong [đặc tả Filecoin Piece](https://spec.filecoin.io/systems/filecoin_files/piece/).
