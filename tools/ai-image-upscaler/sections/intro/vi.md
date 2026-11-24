## Cách tăng độ phân giải ảnh bằng AI

1. Chọn hoặc kéo thả ảnh JPG, PNG hoặc WebP. Hãy dùng bản có chất lượng tốt nhất bạn có, dù ảnh nhỏ.
2. Chọn **2×** hoặc **4×** rồi kiểm tra kích thước đầu ra. Ảnh 400 × 300 sẽ thành 800 × 600 ở mức 2× hoặc 1600 × 1200 ở mức 4×.
3. Chọn **Phóng to ảnh**, rồi kéo thanh trượt để so sánh đường nét và họa tiết. Tải kết quả xuống dưới dạng PNG không mất dữ liệu.

## Siêu phân giải ảnh bằng AI là gì?

Siêu phân giải làm tăng số pixel theo chiều rộng và chiều cao của ảnh có độ phân giải thấp. InBrowser.App dùng Real-ESRGAN, một mô hình đã được huấn luyện để ước tính đường nét và họa tiết chi tiết hơn từ các pixel sẵn có. Nhờ vậy, ảnh chụp nhỏ, hình minh họa và ảnh web đã nén có thể trông rõ hơn khi phóng to. Trong phần xem trước, hãy kiểm tra khuôn mặt, chữ nhỏ và các hoa văn tinh tế. Các chi tiết mới do mô hình ước tính nên có thể khác với cảnh gốc.

## Nên phóng to ảnh 2× hay 4×?

Chọn 2× khi chỉ cần phóng to vừa phải, chẳng hạn để đưa ảnh thu nhỏ vào bố cục lớn hơn. Chọn 4× khi ảnh cần chiếm nhiều diện tích hơn, chẳng hạn khi muốn hiển thị một bản quét nhỏ ở kích thước lớn. Tăng mỗi cạnh gấp đôi sẽ cho số pixel gấp bốn lần. Tăng mỗi cạnh gấp bốn sẽ cho số pixel gấp mười sáu lần. Ảnh đầu vào có thể dài tối đa 2.048 pixel trên mỗi cạnh và có tổng cộng tối đa 1 megapixel.

## Ảnh có được xử lý trên thiết bị của tôi không?

Có. Trình duyệt tải mô hình Real-ESRGAN trong lần phóng to đầu tiên. Ảnh được xử lý trên thiết bị qua WebGPU nếu có hỗ trợ, hoặc qua CPU bằng WebAssembly. Lần đầu có thể lâu hơn và thời gian xử lý tùy thuộc vào kích thước ảnh và thiết bị. Ảnh luôn nằm trên thiết bị của bạn trong suốt quá trình.
