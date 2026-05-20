# Ghép tệp PDF trong trình duyệt của bạn

Dùng công cụ ghép PDF này khi bạn cần tạo một tài liệu từ nhiều PDF nguồn, chẳng hạn như kết hợp các trang đã quét, nối các biểu mẫu đã ký hoặc đóng gói báo cáo để chia sẻ. Thêm hai tệp trở lên, xem lại số trang của chúng, rồi sắp xếp hàng đợi trước khi tạo PDF cuối cùng.

## Thứ tự ghép hoạt động như thế nào

Công cụ sẽ thêm mọi trang từ PDF đầu tiên, rồi mọi trang từ PDF tiếp theo, tiếp tục theo thứ tự trong hàng đợi. Bạn có thể sắp xếp lại tệp bằng các điều khiển mũi tên, kéo các hàng trên máy tính, xóa mục thêm nhầm và xem trước từng tệp nguồn trước khi ghép.

## Quyền riêng tư và xử lý tệp

Toàn bộ quá trình phân tích và ghép chạy cục bộ trong trình duyệt của bạn bằng `pdf-lib` và một worker nền. Tệp của bạn không được tải lên InBrowser.App, và liên kết tải xuống được tạo chỉ tồn tại trong phiên trình duyệt hiện tại.

## Các giới hạn cần biết

PDF đã mã hóa hoặc bị hỏng có thể không ghép được một cách đáng tin cậy. Nếu tệp được bảo vệ bằng mật khẩu chủ sở hữu, hãy xóa hạn chế đó trước rồi thêm lại PDF đã mở khóa. Các tệp rất lớn có thể mất nhiều thời gian hơn vì trình duyệt phải sao chép mọi trang vào một tài liệu mới.
