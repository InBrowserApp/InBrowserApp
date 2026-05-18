Tạo UUID v4 cục bộ trong trình duyệt khi bạn cần một định danh mới cho bản ghi kiểm thử, hàng cơ sở dữ liệu, ví dụ API, payload sự kiện, fixture hoặc tệp cấu hình. Công cụ tạo từng UUID chuẩn dạng chữ thường tại một thời điểm để tập trung vào quy trình một giá trị, không trùng lặp với trình tạo hàng loạt riêng.

## UUID v4 có nghĩa là gì

UUID v4 là định danh 128 bit trong đó các bit phiên bản và biến thể được cố định, còn 122 bit còn lại đến từ dữ liệu ngẫu nhiên. Điều đó khiến nó hữu ích khi bạn cần định danh không tiết lộ thời điểm tạo, thông tin máy, bộ đếm tuần tự hoặc chi tiết người dùng.

## Khi nào nên dùng

Dùng UUID v4 cho ID tạo ở phía client, object giả lập, bản ghi tạm thời, ví dụ công khai và hệ thống phân tán nơi việc phối hợp một bộ đếm trung tâm sẽ bất tiện. Đây là mặc định phù hợp khi thứ tự sắp xếp không quan trọng và bạn chỉ cần một định danh có xác suất va chạm thấp.

## Quyền riêng tư và độ tin cậy

Quá trình tạo chạy trong tab trình duyệt này bằng Web Crypto, nên UUID không được gửi tới InBrowser.App hoặc dịch vụ khác. Sao chép giá trị khi nó trông đúng, rồi tạo lại bất cứ khi nào bạn cần một định danh mới cho bản ghi hoặc ví dụ tiếp theo.
