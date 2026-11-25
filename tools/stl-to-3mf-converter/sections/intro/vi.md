## Chuyển tệp STL sang 3MF

Chọn **Đơn vị tọa độ STL**, sau đó chọn **Mở tệp** hoặc thả tệp `.stl` vào công cụ. Công cụ hỗ trợ cả STL dạng ASCII lẫn nhị phân. Chọn **Thử ví dụ** để chuyển đổi một giá đỡ và **Tải xuống 3MF** để lưu mô hình. Khi bạn đổi đơn vị, công cụ tự chuyển đổi lại tệp đang mở.

## Chọn đúng kích thước cho phần mềm cắt lớp

STL lưu tọa độ mà không ghi đơn vị. Hãy chọn đơn vị của mô hình gốc. Ví dụ, một chi tiết rộng 2 đơn vị tọa độ STL sẽ rộng 2 inch nếu bạn chọn inch, hoặc 2 mm nếu bạn chọn milimét. Tệp 3MF ghi rõ đơn vị để phần mềm cắt lớp tương thích có thể mở mô hình đúng kích thước.

## Kiểm tra mô hình 3MF hoặc chuyển đổi ngược lại

Tệp 3MF giữ nguyên các tam giác gốc. Công cụ ghi mô hình dưới dạng khối đặc nếu lưới bao kín một thể tích và các mặt có hướng nhất quán. Lưới hở hoặc có hướng mặt không nhất quán được ghi dưới dạng bề mặt. Phần mềm cắt lớp xử lý vật liệu và thiết lập in. Mở tệp trong [Trình xem 3MF](../3mf-viewer/) để kiểm tra kích thước hoặc mở tệp gốc bằng [Trình xem STL](../stl-viewer/). Dùng [Công cụ kiểm tra thể tích và tô pô lưới](../mesh-inspector/) nếu lưới gốc có khe hở hoặc lỗi tô pô khác. Để chuyển theo chiều ngược lại, dùng [Trình chuyển đổi 3MF sang STL](../3mf-to-stl-converter/). [Tìm hiểu về định dạng 3MF](https://3mf.io/resources/faq/)
