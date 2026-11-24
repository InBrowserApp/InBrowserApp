## Tạo tệp CAR từ các tệp hoặc một thư mục

Chọn tệp hoặc thư mục rồi chọn **Tạo CAR**. Sao chép CID gốc và lưu tệp `.car`. Trình duyệt đọc các mục đã chọn ngay trên thiết bị rồi đóng gói thành tệp lưu trữ CARv1 có gốc UnixFS. Bạn có thể giữ tệp lưu trữ làm bản sao lưu hoặc nhập vào một nút IPFS hay dịch vụ lưu trữ.

## Tệp lưu trữ giữ nguyên các tệp như thế nào?

Nếu chỉ có một tệp thì tệp đó là mục gốc. Nhiều tệp được đặt trong cùng một thư mục gốc. Khi chọn một thư mục, đường dẫn của các tệp được giữ nguyên. Trình chọn thư mục của trình duyệt cung cấp các tệp và đường dẫn tương ứng. Nếu trình duyệt hỗ trợ kéo thả thư mục, hãy kéo thư mục vào để giữ cả các thư mục con trống.

## CID gốc có ý nghĩa gì?

CID gốc định danh tệp hoặc thư mục đã đóng gói. Trình tạo CAR dùng cùng thiết lập CIDv1 mặc định với Công cụ tính CID IPFS. Cùng một cấu trúc đầu vào sẽ cho cùng một mã định danh nội dung. Để thêm tệp lưu trữ vào Kubo, chạy lệnh `ipfs dag import archive.car` với tên tệp đã tải xuống. [Tài liệu tham khảo lệnh Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
