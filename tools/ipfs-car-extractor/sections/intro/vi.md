## Mở tệp CAR của IPFS hoặc Filecoin trực tuyến

Chọn tệp `.car` trên thiết bị. Công cụ đọc tệp lưu trữ ngay trên thiết bị và hiển thị CID gốc. Nếu tệp chứa nhiều CID gốc, hãy chọn mục bạn muốn mở. CAR là định dạng lưu trữ định địa chỉ theo nội dung (Content Addressable aRchive) dùng trong IPFS và Filecoin. Danh mục tài nguyên của Apple dùng một định dạng khác có cùng phần mở rộng.

## Trích xuất tệp hoặc chuyển thư mục CAR thành ZIP

Mở thư mục để xem nội dung. Chọn một tệp rồi nhấn **Tải tệp xuống** để lưu dữ liệu gốc của tệp. Chọn **Tải ZIP xuống** để xuất thư mục cùng với tất cả thư mục con. Tệp ZIP giữ nguyên cấu trúc thư mục UnixFS.

## Thiếu khối dữ liệu nghĩa là gì?

CAR lưu nội dung thành các khối được định danh bằng CID. Một CID gốc có thể liên kết tới các khối nằm ngoài tệp lưu trữ chưa đầy đủ. Nếu một mục cần khối không có trong tệp, hãy lấy bản xuất đầy đủ từ nguồn hoặc tải mục khác có đủ các khối cần thiết. Tệp CAR cũng có thể chứa dữ liệu ở các định dạng IPLD khác. Công cụ này trích xuất tệp và thư mục dùng UnixFS. [Định dạng CAR của IPLD](https://ipld.io/specs/transport/car/)
