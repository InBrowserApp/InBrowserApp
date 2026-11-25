## Chuyển bản vẽ DXF sang SVG

Chọn **Mở tệp DXF** hoặc thả bản vẽ `.dxf` dạng ASCII vào công cụ. Dùng **Thử ví dụ** để mở bản vẽ giá đỡ có đường bao, lỗ khoan, đường tâm và nhãn. Công cụ đọc bản vẽ trong trình duyệt và hiển thị bản xem trước dạng vector. Chọn **Tải xuống SVG** để lưu hình học đã chọn trong không gian mô hình thành một tệp SVG độc lập.

## Chọn các lớp để xuất

Chọn các lớp cần xuất trong **Lớp**. Bản xem trước cập nhật khi bạn chọn hoặc bỏ chọn một lớp. Ví dụ, xuất đường bao và các lỗ để làm hình minh họa hoặc chọn thêm đường tâm và nhãn để có bản vẽ chú thích. SVG lưu từng lớp đã chọn thành một nhóm vector riêng.

## Giữ tỷ lệ bản vẽ

Khi DXF khai báo đơn vị chiều dài như milimét hoặc inch, SVG ghi kích thước vật lý theo milimét. Hình học giữ nguyên tỷ lệ gốc trong tệp. Với bản vẽ DXF không khai báo đơn vị, thuộc tính viewBox của SVG sử dụng tọa độ bản vẽ. Bản xem trước tự điều chỉnh cho vừa với vùng hiển thị. [Các biến phần đầu tệp DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Xuất hình học trong không gian mô hình

Công cụ xuất các đoạn thẳng, đường đa tuyến, cung, đường tròn, khối và văn bản được hỗ trợ. Đường cong được vẽ bằng các đoạn vector. Văn bản được hỗ trợ chuyển thành đường bao vector dựa trên phông chữ có sẵn. Nếu bản vẽ nằm trên trang bố cục, hãy chuyển hình học sang không gian mô hình trước khi xuất DXF. Để kiểm tra bản vẽ, hãy dịch chuyển, thu phóng và bật tắt các lớp trong [Trình xem DXF](../dxf-viewer/).
