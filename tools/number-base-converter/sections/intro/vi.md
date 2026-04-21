Chuyển đổi số nguyên trực tiếp trong trình duyệt giữa nhị phân, bát phân, thập phân, thập lục phân, Base32, Base36, Base62, Base64 và các cơ số tùy chỉnh từ 2 đến 64. Mọi phép tính đều chạy cục bộ bằng BigInt, vì vậy bạn có thể kiểm tra các giá trị lớn mà không cần gửi chúng lên máy chủ.

## Khi nào nên dùng

Công cụ này hữu ích khi cùng một số nguyên xuất hiện trong log, giao thức, ID hoặc tài liệu kỹ thuật với các bảng chữ cái khác nhau. Chỉnh sửa bất kỳ trường nào sẽ tính lại các trường còn lại ngay lập tức, phù hợp cho gỡ lỗi, viết tài liệu và kiểm tra thủ công.

## Khác biệt giữa các cơ số

Tới cơ số 36, chữ cái được chấp nhận mà không phân biệt hoa thường. Các cơ số cao hơn xem chữ hoa và chữ thường là các chữ số khác nhau, và hàng Base64 ở đây dùng bảng chữ cái số `A-Z a-z 0-9 + /`, không phải mã hóa Base64 văn bản theo byte.

## Lưu ý

Chỉ hỗ trợ số nguyên không âm. Các số 0 ở đầu chỉ được xem là định dạng, vì vậy kết quả sau khi chuyển đổi sẽ được chuẩn hóa và có thể không giữ lại phần đệm bạn đã nhập.
