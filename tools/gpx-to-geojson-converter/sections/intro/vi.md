## Cách chuyển GPX sang GeoJSON

Mở tệp .gpx hoặc dán XML của GPX rồi chọn **Chuyển sang GeoJSON**. Chọn **Dùng thử ví dụ** để xem một vệt đường, một tuyến đường và một điểm đánh dấu trong kết quả. Sao chép GeoJSON hoặc tải tệp .geojson xuống để dùng trong dự án bản đồ hoặc GIS. Quá trình chuyển đổi chạy trong trình duyệt và dữ liệu đầu vào được giữ trên thiết bị.

## Cách chuyển đổi vệt đường, tuyến đường và điểm đánh dấu

Kết quả là một FeatureCollection của GeoJSON. Điểm đánh dấu trở thành điểm, tuyến đường trở thành đường, còn vệt đường có nhiều đoạn liên tục vẫn giữ từng đoạn riêng biệt. Đoạn hoặc tuyến chỉ có một tọa độ sẽ trở thành điểm. Các trường mô tả như tên và ghi chú vẫn đi kèm đối tượng tương ứng.

## Tọa độ, độ cao và thời gian

GeoJSON lưu vị trí theo thứ tự kinh độ rồi đến vĩ độ. Các đường cắt qua kinh tuyến 180° được tách tại kinh tuyến đó để hiển thị trên bản đồ thế giới. Nếu có độ cao, giá trị này được lưu làm tọa độ thứ ba, tính bằng mét. Thời gian của từng điểm được lưu trong thuộc tính của đối tượng. Các mốc thời gian dọc theo tuyến và từng đoạn vệt đường giữ nguyên thứ tự tọa độ để có thể đối chiếu với vị trí. Bạn có thể mở kết quả bằng [Trình xem GeoJSON](../geojson-viewer/) hoặc xem tệp GPX gốc bằng [Trình xem GPX và biểu đồ độ cao](../gpx-viewer/).
