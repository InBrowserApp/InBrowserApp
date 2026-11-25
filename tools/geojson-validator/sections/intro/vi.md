## Cách kiểm tra tệp GeoJSON

Mở tệp .geojson hoặc .json, hoặc dán nội dung GeoJSON rồi chọn **Kiểm tra GeoJSON**. Chọn **Dùng thử ví dụ** để xem một FeatureCollection hợp lệ. Bạn có thể chỉnh sửa dữ liệu đầu vào rồi kiểm tra lại. Tệp và văn bản đã dán được giữ trong trình duyệt.

## Công cụ kiểm tra những gì?

Công cụ kiểm tra cú pháp JSON trước, sau đó kiểm tra cấu trúc GeoJSON, bao gồm FeatureCollection, Feature, GeometryCollection và từng kiểu hình học. Vị trí dùng tọa độ WGS 84 theo thứ tự kinh độ rồi đến vĩ độ. Công cụ kiểm tra phạm vi tọa độ, số vị trí tối thiểu của đường và vòng, việc khép kín vòng đa giác, thuộc tính đối tượng và cấu trúc của hộp bao. Tập hợp đối tượng rỗng và hình học có giá trị null đều hợp lệ.

## Tìm và sửa lỗi

Đường dẫn lỗi như `$.features[0].geometry.coordinates` chỉ đến tọa độ của đối tượng đầu tiên. Sửa trường được chỉ định rồi kiểm tra lại. Kết quả cho biết cấu trúc của tệp. Các vấn đề tô pô hình học, chẳng hạn như tự cắt hoặc chồng lấn, cần được kiểm tra riêng trong công cụ GIS. Để xem trực quan dữ liệu hợp lệ, hãy mở bằng [Trình xem GeoJSON](../geojson-viewer/).
