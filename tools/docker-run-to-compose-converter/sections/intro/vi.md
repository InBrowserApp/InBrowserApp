## Công cụ này làm gì

Trình chuyển Docker Run sang Compose chuyển một hoặc nhiều lệnh `docker run`
thành tệp `docker-compose.yml` trong trình duyệt. Bạn có thể kiểm tra YAML đã tạo,
sao chép hoặc tải xuống trước khi đưa vào dự án.

## Khi nào nên dùng

Dùng công cụ này khi bạn muốn biến một lệnh chạy container dùng một lần thành
định nghĩa dịch vụ Compose có thể tái sử dụng, hoặc muốn xem cách ánh xạ cổng,
volume, biến môi trường và các cờ tài nguyên sang Compose.

## Những gì có thể mong đợi

Các tùy chọn phổ biến như cổng, biến môi trường, chính sách khởi động lại,
kiểm tra tình trạng, điểm gắn kết và giới hạn tài nguyên được giữ nguyên. Các cờ
không được hỗ trợ hoặc chưa rõ nghĩa sẽ được hiển thị dưới dạng cảnh báo để bạn
có thể kiểm tra đầu ra trước khi sử dụng.
