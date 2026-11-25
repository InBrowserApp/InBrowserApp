## Tạo hàng loạt địa chỉ email kiểm thử

Chọn tên miền, nhập số lượng rồi nhấn **Tạo**. Chọn **Tên miền ví dụ bất kỳ** để trộn nhiều tên miền trong cùng một danh sách. Mỗi địa chỉ chỉ xuất hiện một lần trong danh sách đã tạo. Sao chép kết quả vào biểu mẫu hoặc bảng tính, hoặc tải xuống tệp văn bản UTF-8 với mỗi địa chỉ trên một dòng để làm dữ liệu kiểm thử.

## Có thể dùng những tên miền email nào?

Faker.js tạo địa chỉ với các tên miền `example.com`, `example.net` và `example.org`. Đây là các [tên miền dành riêng cho ví dụ](https://www.iana.org/help/example-domains), dùng trong tài liệu và dữ liệu mẫu. Trong `alex.morgan42@example.com`, phần trước dấu `@` là phần local, còn `example.com` là tên miền. Dùng một tên miền khi bài kiểm thử yêu cầu giá trị cố định, hoặc dùng nhiều tên miền để kiểm thử chức năng lọc và nhập dữ liệu.

## Có thể kiểm thử gì với các địa chỉ này?

Dùng các địa chỉ mẫu này để kiểm thử trường nhập trên biểu mẫu đăng ký, định dạng email, danh sách tài khoản hoặc loại bỏ dữ liệu trùng lặp trong cơ sở dữ liệu. Công cụ chỉ tạo địa chỉ dưới dạng văn bản. Để kiểm thử việc nhận thư hoặc liên kết xác minh, hãy dùng hộp thư bạn quản lý hoặc môi trường thử nghiệm gửi thư của nhóm phát triển.
