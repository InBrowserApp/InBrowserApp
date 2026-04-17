## Mã số VAT của EU là gì?

Mã số định danh VAT được một quốc gia thành viên EU cấp cho các doanh nghiệp đã đăng ký Thuế Giá trị Gia tăng. Nó bắt đầu bằng mã quốc gia gồm hai chữ cái (ví dụ, `BE` cho Bỉ hoặc `EL` cho Hy Lạp), tiếp theo là một chuỗi chữ số và đôi khi là chữ cái đặc thù cho từng quốc gia. Cơ quan thuế sử dụng mã này để theo dõi giao dịch xuyên biên giới và các yêu cầu hoàn thuế, vì vậy sai sót trên hóa đơn, hợp đồng hay hồ sơ mua sắm có thể dễ dàng khiến một khoản thanh toán bị chặn hoặc kích hoạt một cuộc kiểm toán.

## Công cụ này thực sự kiểm tra điều gì

Trình kiểm tra này chạy ba bước xác thực độc lập, tất cả đều trong trình duyệt của bạn:

1. **Mã quốc gia** — hai chữ cái đầu phải khớp với một quốc gia thành viên EU tham gia hệ thống VAT (bao gồm cả mã đặc biệt `EL` dùng cho Hy Lạp).
2. **Định dạng** — các ký tự còn lại phải khớp với định dạng VAT được quy định của quốc gia. Ví dụ, VAT của Bỉ có đúng mười chữ số, VAT của Áo bắt đầu bằng `U` theo sau là tám chữ số, và VAT của Hà Lan có dạng `<chín chữ số>B<hai chữ số>`.
3. **Checksum** — khi quy tắc VAT của quốc gia có checksum xác định (Áo, Bỉ, Đan Mạch, Phần Lan, Pháp, Đức, Ý, Hà Lan, Ba Lan, Bồ Đào Nha, Tây Ban Nha, Thụy Điển), chữ số hoặc chữ cái cuối cùng sẽ được tính lại và so sánh.

Một mã số vượt qua cả ba bước là đúng về mặt cú pháp. Điều đó không đồng nghĩa với việc xác nhận rằng doanh nghiệp hiện đang được đăng ký — để biết điều đó, bạn vẫn cần dùng dịch vụ VIES của Ủy ban Châu Âu hoặc cơ quan thuế địa phương. Công cụ này phù hợp nhất khi dùng trước bước kiểm tra cuối cùng đó, để bắt các lỗi đánh máy, đảo chữ số và lỗi sao chép-dán khiến truy vấn VIES thất bại vì lý do không đúng.

## Những lỗi thường gặp mà nó phát hiện

- Các mã số trông có vẻ đúng nhưng thiếu mã quốc gia (ví dụ, bắt đầu bằng `US` hoặc `UK`).
- Các số 0 đứng đầu bị bảng tính cắt bỏ, tạo ra mã số ngắn hơn một chữ số so với yêu cầu.
- Khoảng trắng, dấu chấm hoặc dấu gạch ngang do hệ thống hóa đơn dán vào — công cụ sẽ chuẩn hóa chúng đi và kiểm tra kết quả.
- Nhầm lẫn kinh điển giữa `GR` (Hy Lạp) và mã VAT `EL`, điều mà bước kiểm tra định dạng sẽ từ chối ngay lập tức.

## Thẻ kết quả hiển thị những gì

Ngoài huy hiệu hợp lệ/không hợp lệ đơn giản, kết quả còn tách riêng quốc gia, mã số đã chuẩn hóa, định dạng mà quốc gia đó yêu cầu, và checksum đã đạt, không đạt, hay bị bỏ qua vì quốc gia không công bố. Chi tiết đó hữu ích khi bạn cần giải thích lý do bị từ chối — "định dạng đúng, checksum không khớp" có tính hành động cao hơn nhiều so với "không hợp lệ."

## Quyền riêng tư

Mọi kiểm tra đều chạy cục bộ trong trình duyệt của bạn. Không có gì được gửi đến máy chủ, ghi log hay lưu trữ ở bất kỳ đâu ngoài localStorage của chính trình duyệt bạn (để lưu nội dung nhập gần nhất, giúp nó tồn tại qua lần tải lại trang). Bạn có thể dán mã số VAT của khách hàng mà không cần lo lắng về việc nó sẽ đi đâu.
