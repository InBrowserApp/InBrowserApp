Gỡ các hạn chế do mật khẩu chủ sở hữu khỏi PDF ngay trong trình duyệt của bạn. Công cụ tạo một PDF mới không còn mang các cờ quyền cho chỉnh sửa, in, sao chép hoặc trích xuất trang.

## Khi nào nên dùng

Dùng công cụ này khi bạn đã có một PDF mở bình thường, nhưng tài liệu chặn các thao tác thông thường như in, sao chép văn bản, chỉnh sửa trang hoặc ghép trang trong một công cụ PDF khác. Điều này thường gặp ở biểu mẫu, báo cáo đã xuất, hóa đơn cũ và tài liệu được tạo với các thiết lập quyền PDF hạn chế.

## Cách hoạt động

Tải lên một PDF, xem lại tệp đã chọn, rồi chạy bước gỡ hạn chế. Công cụ chạy qpdf trong worker của trình duyệt với thao tác PDF `--decrypt` và trả về một tệp PDF mới để tải xuống. Tệp gốc không bị thay đổi, vì vậy bạn có thể so sánh hoặc bỏ kết quả nếu đó không phải phiên bản bạn cần.

## Quyền riêng tư và giới hạn

PDF vẫn ở trong phiên trình duyệt này; tệp không được tải lên máy chủ. Công cụ này gỡ các hạn chế quyền do mật khẩu chủ sở hữu khỏi những PDF đã có thể mở được. Công cụ không khôi phục mật khẩu người dùng/mật khẩu mở bị mất và không thể mở khóa tệp bị hỏng hoặc các chế độ mã hóa không được bản dựng qpdf phía trình duyệt hỗ trợ.
