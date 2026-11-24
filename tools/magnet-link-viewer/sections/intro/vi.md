Liên kết magnet dùng mã băm thông tin để định danh một torrent BitTorrent. Liên kết cũng có thể chứa tên hiển thị, địa chỉ tracker, web seed hoặc nguồn siêu dữ liệu. Để xem tên và kích thước thực tế của các tệp, ứng dụng cần lấy siêu dữ liệu của torrent.

## Cách kiểm tra liên kết magnet

Dán liên kết `magnet:?` và chọn nút tra cứu. Trình xem hiển thị mã băm thông tin cùng tên hoặc địa chỉ tracker có trong liên kết. Khi WebTorrent lấy được siêu dữ liệu, trình xem sẽ hiển thị tên torrent, đường dẫn và kích thước tệp, tổng dung lượng và thông tin các mảnh. Bạn có thể lọc danh sách tệp và sao chép mã băm thông tin.

## Vì sao một số liên kết magnet không phân giải được

Trong trình duyệt, WebTorrent cần các peer hỗ trợ WebRTC và có thể kết nối được, thường được tìm thấy thông qua tracker WebSocket. Một số liên kết magnet còn chứa nguồn siêu dữ liệu HTTPS mà trình duyệt có thể đọc. Liên kết hoạt động trong ứng dụng torrent trên máy tính vẫn có thể hết thời gian chờ tại đây. Nếu có tệp `.torrent`, bạn có thể dùng trình xem tệp được liên kết để đọc ngay.

## Quá trình tra cứu kết nối tới đâu

Việc tra cứu chạy trong trình duyệt. WebTorrent có thể kết nối tới tracker, peer hoặc nguồn siêu dữ liệu của torrent bạn yêu cầu. Các dịch vụ này có thể thấy địa chỉ IP và torrent bạn đang tra cứu. Trình xem chỉ yêu cầu siêu dữ liệu và không tải xuống các tệp được liệt kê. Liên kết magnet phải có mã băm thông tin BitTorrent v1 (`btih`), kể cả khi liên kết cũng định danh một torrent v2.
