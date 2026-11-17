## Trình xem này hiển thị những gì

Trình xem thông tin đa phương tiện đọc siêu dữ liệu kỹ thuật của các tệp âm thanh
và video trên thiết bị, bao gồm MP4, MOV, MKV, WebM, AVI, MP3, FLAC và WAV. Bạn có
thể dùng công cụ để kiểm tra thông số của tệp đã xuất, kiểm tra nhãn ngôn ngữ của
các luồng âm thanh trong phim hoặc thu thập báo cáo kỹ thuật để khắc phục sự cố.
Quá trình phân tích bắt đầu ngay khi bạn chọn hoặc thả tệp vào.

## Thông tin về tệp, video, âm thanh và phụ đề

- **Tổng quan về tệp:** định dạng vùng chứa thực tế, kích thước tệp, thời lượng,
  tổng tốc độ bit, tiêu đề và ứng dụng mã hóa, nếu có.
- **Luồng video:** bộ mã hóa/giải mã, cấu hình và tốc độ bit, độ phân giải, tốc độ
  khung hình và chế độ tốc độ khung hình, tỷ lệ khung hình, góc xoay, độ sâu bit,
  không gian màu, lấy mẫu con sắc độ và định dạng HDR.
- **Luồng âm thanh:** bộ mã hóa/giải mã, tốc độ bit, ngôn ngữ, tiêu đề luồng, số
  kênh và bố trí kênh, tần số lấy mẫu, độ sâu bit và cờ mặc định hoặc bắt buộc.
  Mỗi luồng âm thanh được liệt kê riêng, giúp phân biệt âm thanh gốc, bản lồng
  tiếng và lời bình.
- **Luồng phụ đề:** định dạng, ngôn ngữ, tiêu đề, thời lượng và cờ mặc định hoặc
  bắt buộc nếu tệp có những thông tin này.

Các thông số chính được hiển thị ngay. Mở **Chi tiết kỹ thuật** trong một luồng
để xem thêm các trường, hoặc chọn liên kết số lượng luồng để chuyển đến luồng
đầu tiên thuộc loại đó. Các trường có sẵn tùy thuộc vào định dạng và siêu dữ liệu
của tệp.

## Cách kiểm tra tệp

1. Chọn một tệp âm thanh hoặc video trên thiết bị, hoặc kéo tệp vào vùng chọn tệp.
2. Xem phần tổng quan, sau đó kiểm tra từng luồng video, âm thanh và phụ đề.
3. Sao chép báo cáo dễ đọc để đưa vào tin nhắn hoặc yêu cầu hỗ trợ, hoặc tải JSON
   để lập danh mục tài nguyên, dùng trong tập lệnh hoặc phân tích thêm. Cả hai
   đều bao gồm những trường kỹ thuật đang được thu gọn trong giao diện.
4. Chọn **Đổi tệp** để kiểm tra một tệp khác, hoặc **Xóa tệp** để xóa kết quả.
   Việc chọn một tệp khác hoặc xóa tệp hiện tại cũng dừng quá trình phân tích
   đang diễn ra.

## Hiểu các số liệu

- **Vùng chứa và bộ mã hóa/giải mã mô tả những khía cạnh khác nhau.** MP4 và
  Matroska là các định dạng vùng chứa; AVC/H.264, HEVC/H.265 và AAC mô tả cách
  mã hóa các luồng. Một vùng chứa có thể chứa nhiều luồng âm thanh hoặc phụ đề.
- **Tổng tốc độ bit áp dụng cho toàn bộ tệp.** Giá trị này bao gồm tất cả các
  luồng và phần dữ liệu phụ của vùng chứa. Tốc độ bit của một luồng chỉ áp dụng
  cho luồng đó. Tốc độ bit dùng đơn vị kb/s hoặc Mb/s; kích thước tệp dùng B,
  KiB, MiB, GiB hoặc TiB.
- **Thời lượng bao gồm mili giây.** Giao diện hiển thị theo dạng `HH:MM:SS.mmm`.
  Tốc độ khung hình dùng fps, còn tần số lấy mẫu âm thanh dùng kHz. CFR biểu thị
  tốc độ khung hình cố định; VFR biểu thị tốc độ khung hình thay đổi.
- **Cờ của luồng cho biết cách lựa chọn dự kiến.** Cờ mặc định đánh dấu luồng
  được ưu tiên; cờ bắt buộc thường dùng cho phụ đề cần xuất hiện mà không phải
  chọn một luồng phụ đề đầy đủ. Đây là những cờ riêng biệt được đọc từ tệp.

Một số định dạng vùng chứa không cung cấp tốc độ bit riêng cho từng luồng.
Những giá trị không có sẽ được bỏ trống hoặc đánh dấu là không có thông tin;
công cụ không suy đoán từ tên tệp. Ảnh bìa nhúng không được tính là luồng video.

## Các trường hợp sử dụng phổ biến

Kiểm tra độ phân giải và tốc độ khung hình sau khi xuất video, kiểm tra số kênh
và tần số lấy mẫu trước khi chỉnh sửa âm thanh, xác định các luồng ngôn ngữ hoặc
lời bình khác nhau, hoặc thu thập thông tin về bộ mã hóa/giải mã khi tìm hiểu sự
cố phát lại. Báo cáo giúp bạn chia sẻ các thông số liên quan mà không cần gửi
tệp đa phương tiện.

## Xử lý trên thiết bị và xuất báo cáo

Quá trình phân tích diễn ra trong trình duyệt: tệp đa phương tiện không được
tải lên và nội dung tệp không bị thay đổi. Bộ phân tích đọc các đoạn của tệp
khi cần, nên có thể kiểm tra siêu dữ liệu ngay cả khi trình duyệt không phát
được định dạng vùng chứa hoặc bộ mã hóa/giải mã đó.

**Sao chép báo cáo** tạo bản tóm tắt bằng văn bản dễ đọc. **Tải JSON** xuất siêu
dữ liệu do bộ phân tích trả về, kèm theo tên và kích thước tệp. Trong JSON,
`Duration` dùng đơn vị giây, `BitRate` và `OverallBitRate` dùng bit trên giây,
còn `SamplingRate` dùng hertz. Giao diện chuyển đổi các giá trị này sang đơn vị
dễ đọc hơn. Bản xuất cũng giữ lại những trường siêu dữ liệu bổ sung ngoài các
trường hiển thị trong thẻ thông tin của từng luồng.
