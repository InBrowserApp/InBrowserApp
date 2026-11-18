## Chuyển đổi giữa tên miền Unicode và Punycode

Dán tên miền như `bücher.com` vào **Tên miền Unicode** để nhận `xn--bcher-kva.com` trong ô **Tên miền ASCII**. Dán tên miền có `xn--` vào **Tên miền ASCII** để đọc tên miền ở dạng Unicode. Hai ô cập nhật khi bạn nhập và bạn có thể sao chép kết quả ở cả hai dạng.

## Khi nào dùng từng dạng

Punycode biểu diễn các ký tự ngoài bảng mã ASCII trong tên miền quốc tế hóa (IDN) bằng chữ cái ASCII, chữ số và dấu gạch nối. Phần tên miền được chuyển đổi có tiền tố `xn--`, còn các phần ASCII như `com` giữ nguyên. Dùng dạng ASCII nếu phần cài đặt DNS hoặc dịch vụ lưu trữ yêu cầu. Dùng dạng Unicode để đọc tên miền trong nhật ký hoặc tệp cấu hình.

## Nội dung cần nhập

Chỉ nhập phần tên máy chủ. Với `https://bücher.com/catalog`, hãy dán `bücher.com`. Công cụ cũng hỗ trợ tên miền phụ. Ví dụ, `www.bücher.com` chuyển thành `www.xn--bcher-kva.com`.
