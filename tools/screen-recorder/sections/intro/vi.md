# Trình ghi màn hình

Ghi lại màn hình, cửa sổ hoặc thẻ do trình duyệt chọn mà không tải video lên
máy chủ. Công cụ này dùng API Screen Capture và MediaRecorder của trình duyệt,
vì vậy bản ghi vẫn nằm cục bộ cho đến khi bạn tải xuống.

## Khi nào nên dùng

Dùng trình ghi cho bản demo ngắn, báo cáo lỗi, hướng dẫn thao tác, ghi chú QA
hoặc video nội bộ nhanh khi quy trình nhẹ trong trình duyệt là đủ. Bạn có thể
yêu cầu trình duyệt đưa âm thanh thẻ hoặc âm thanh hệ thống vào bản ghi và tùy
chọn trộn thêm âm thanh từ micrô trước khi bắt đầu ghi.

## Quyền riêng tư và hỗ trợ trình duyệt

Trình duyệt quyết định nguồn ghi và tùy chọn âm thanh nào khả dụng. Một số
trình duyệt chỉ chia sẻ âm thanh cho thẻ hiện tại, một số yêu cầu HTTPS, và một
số không hỗ trợ tạm dừng hoặc ghi màn hình. Nếu quyền bị từ chối, không luồng
nào được giữ lại và bạn có thể thử lại với cài đặt khác.

## Mẹo để ghi ổn định

Đóng các phiên ghi không liên quan trước khi bắt đầu, chọn nguồn nhỏ nhất vẫn
đủ dùng, và thử ghi ngắn nếu âm thanh quan trọng. Tải kết quả xuống trước khi
xóa, vì bản ghi chỉ được giữ trong phiên trang hiện tại.
