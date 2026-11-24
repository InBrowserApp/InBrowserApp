## Cách chuyển bản ghi âm thành văn bản

Thả bản ghi cuộc họp, phỏng vấn, bài giảng, podcast hoặc ghi chú thoại vào công cụ. Giữ chế độ tự động nhận diện ngôn ngữ, hoặc tự chọn ngôn ngữ nếu bạn biết bản ghi dùng tiếng gì. Chọn mô hình Whisper rồi bấm **Chuyển thành văn bản**. Khi có bản chép lời, chọn một mốc thời gian để nghe lại đoạn tương ứng. Bạn có thể sửa tên riêng, dấu câu và những từ bị nhận dạng sai trước khi sao chép hoặc tải xuống.

Công cụ đọc được các định dạng âm thanh mà trình duyệt hỗ trợ, gồm những định dạng phổ biến như MP3, WAV, M4A, FLAC, OGG và WebM. Khả năng giải mã tùy vào trình duyệt. Nếu tệp không mở được, hãy thử xuất lại bản ghi ở định dạng WAV hoặc MP3 từ ứng dụng ghi âm.

## Nên chọn mô hình nhận dạng giọng nói nào?

Bắt đầu với **Nhanh (Whisper Base)** nếu bản ghi rõ tiếng hoặc bạn cần một bản nháp. **Cân bằng (Whisper Small)** phù hợp với hội thoại và các giọng vùng miền. **Chính xác nhất (Whisper Large V3 Turbo)** là mô hình có khả năng xử lý bản ghi khó nghe tốt nhất trong ba lựa chọn, với dung lượng tải xuống và mức sử dụng bộ nhớ cao hơn. Cả ba mô hình đều hỗ trợ nhiều ngôn ngữ và chép lời bằng đúng ngôn ngữ trong bản ghi.

Whisper sử dụng WebGPU khi trình duyệt và phần cứng đồ họa hỗ trợ. Công cụ cũng có thể chạy trên CPU qua WebAssembly. Lần đầu sử dụng, trình duyệt sẽ tải mô hình bạn chọn và có thể dùng lại những tệp mô hình còn trong bộ nhớ đệm. Dung lượng tải xuống và thời gian xử lý tùy thuộc vào mô hình và thiết bị. Thiết bị của bạn tự giải mã và chép lời bản ghi, còn quá trình tải mô hình không gửi đi âm thanh.

## Xuất bản chép lời hoặc phụ đề có mốc thời gian

- **TXT** ghi thời điểm bắt đầu của từng đoạn. Ví dụ, `[00:02:15.320] Hãy xem qua chương trình họp.` là một câu được nói ở thời điểm hơn hai phút kể từ đầu bản ghi. Định dạng này phù hợp với biên bản cuộc họp, trích dẫn phỏng vấn và văn bản có thể tìm kiếm.
- **SRT (SubRip)** ghi thời điểm bắt đầu và kết thúc của từng đoạn phụ đề được đánh số. Đây là định dạng phổ biến trong các trình biên tập video.
- **VTT (WebVTT)** cũng ghi thời điểm bắt đầu và kết thúc của từng đoạn phụ đề, dùng được với trình phát video HTML có hỗ trợ rãnh phụ đề.

Whisper ước tính thời điểm bắt đầu và kết thúc của mỗi đoạn. Hãy nghe lại các trích dẫn quan trọng và kiểm tra thời gian hiển thị của phụ đề trước khi chia sẻ. Tiếng ồn xung quanh hoặc nhiều người nói cùng lúc có thể ảnh hưởng đến kết quả. Bản chép lời được chia thành các đoạn theo thời gian.
