## Chuyển tệp STEP hoặc STP sang STL

Chọn **Mở tệp** hoặc thả tệp `.step` hay `.stp` vào công cụ chuyển đổi. Công cụ chia các bề mặt CAD thành tam giác ngay trên thiết bị và tạo tệp STL nhị phân. Chọn **Thử ví dụ** để chuyển đổi một giá đỡ, rồi chọn **Tải xuống STL** để lưu kết quả.

## Giữ đúng kích thước khi in 3D

STEP lưu kích thước vật lý. Công cụ xuất tọa độ theo milimét, bao gồm vị trí của từng chi tiết trong cụm lắp ráp. STL không lưu đơn vị, nên hãy chọn milimét khi mở kết quả trong phần mềm cắt lớp. Ví dụ, một cạnh dài 1 inch trong STEP sẽ dài 25,4 đơn vị tọa độ trong STL.

## Kiểm tra lưới đã xuất

Tệp STL chứa các bề mặt được chia thành tam giác của các chi tiết tại vị trí lắp ráp. Dùng STEP khi bạn cần chỉnh sửa bề mặt CAD hoặc giữ tên chi tiết và cấu trúc lắp ráp. Mở STL bằng [Trình xem STL](../stl-viewer/) hoặc kiểm tra thể tích bao kín và tô pô bằng [Công cụ kiểm tra thể tích và tô pô lưới](../mesh-inspector/).

## Kiểm tra hoặc xuất mô hình gốc

Dùng [Trình xem STEP](../step-viewer/) để kiểm tra kích thước, xoay mô hình CAD và xuất STL ngay từ thanh công cụ. Nếu phần mềm cắt lớp hỗ trợ STEP, hãy mở tệp gốc và chọn các thiết lập tạo lưới trong phần mềm đó. [Các định dạng PrusaSlicer hỗ trợ](https://help.prusa3d.com/article/supported-file-formats_1772)
